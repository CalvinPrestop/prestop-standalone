using System.Text.RegularExpressions;

public record ScanResult(bool Success, string? Code = null, string? Error = null,
    string? DocumentType = null, string? FirstName = null, string? LastName = null,
    string? DocumentNumber = null, string? Nationality = null, string? DateOfBirth = null,
    string? ExpiryDate = null, bool? CheckDigitsValid = null)
{
    public static ScanResult Fail(string code, string error) => new(false, code, error);
}

public static class MrzParser
{
    public static ScanResult Parse(string? first, string? second, string? third, string? docType)
    {
        var a = Clean(first); var b = Clean(second); var c = Clean(third);
        if ((a.Length == 30 && b.Length == 30 && c.Length == 30) || (a.Length == 36 && b.Length == 36))
            return ScanResult.Fail("unsupported_document", "ID-card MRZ detected. TD1/TD2 parsing is not enabled yet.");
        if (a.Length != 44 || b.Length != 44 || c.Length != 0 || !a.StartsWith('P') ||
            !Regex.IsMatch(a + b, "^[A-Z0-9<]+$") || !Regex.IsMatch(a[1..], "^[A-Z<]+$") || !Regex.IsMatch(b.Substring(10, 3), "^[A-Z<]{3}$"))
            return ScanResult.Fail("invalid_mrz", "No supported passport MRZ. Reposition the document and retry.");
        bool valid = Check(b[..9], b[9]) && Check(b.Substring(13, 6), b[19]) &&
            Check(b.Substring(21, 6), b[27]) &&
            (Check(b.Substring(28, 14), b[42]) || (b[42] == '<' && b.Substring(28, 14).All(x => x == '<'))) &&
            Check(b[..10] + b.Substring(13, 7) + b.Substring(21, 22), b[43]);
        if (!valid || !ValidDate(b.Substring(13, 6)) || !ValidDate(b.Substring(21, 6)))
            return ScanResult.Fail("invalid_mrz", "MRZ validation failed. Reposition the document and retry.");
        var names = a[5..].Split("<<", 2);
        if (names.Length != 2 || Decode(names[0]).Length == 0 || Decode(names[1]).Length == 0)
            return ScanResult.Fail("invalid_mrz", "Passport names could not be read. Retry.");
        return new(true, DocumentType: "Passport", FirstName: Decode(names[1]), LastName: Decode(names[0]),
            DocumentNumber: b[..9].TrimEnd('<'), Nationality: b.Substring(10, 3),
            DateOfBirth: Date(b.Substring(13, 6)), ExpiryDate: Date(b.Substring(21, 6)), CheckDigitsValid: true);
    }
    static string Clean(string? s) => (s ?? "").Trim().ToUpperInvariant();
    static string Decode(string s) => Regex.Replace(s.Trim('<').Replace('<', ' '), " +", " ");
    static string Date(string s) => $"{s[..2]}-{s.Substring(2, 2)}-{s.Substring(4, 2)} (YY-MM-DD; century unverified)";
    static bool ValidDate(string s) => Regex.IsMatch(s, "^[0-9]{6}$") &&
        DateTime.TryParseExact("20" + s, "yyyyMMdd", System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, out _);
    static bool Check(string s, char digit)
    {
        int[] weights = [7, 3, 1]; int sum = 0;
        for (int i = 0; i < s.Length; i++)
        {
            char c = s[i]; int n = c == '<' ? 0 : c is >= '0' and <= '9' ? c - '0' : c is >= 'A' and <= 'Z' ? c - 'A' + 10 : -1;
            if (n < 0) return false;
            sum += n * weights[i % 3];
        }
        return digit is >= '0' and <= '9' && sum % 10 == digit - '0';
    }
}
