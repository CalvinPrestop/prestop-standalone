using System.Net;

var builder = WebApplication.CreateBuilder(args);
// Explicit Kestrel listener prevents ASPNETCORE_URLS or command-line URLs opening the service to LAN.
builder.WebHost.ConfigureKestrel(options => options.Listen(IPAddress.Loopback, 5081));
var origins = (Environment.GetEnvironmentVariable("PRESTOP_ALLOWED_ORIGINS") ?? "http://localhost:5173,http://127.0.0.1:5173")
    .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
if (origins.Length == 0 || origins.Any(x => !Uri.TryCreate(x, UriKind.Absolute, out var u) ||
    (u.Scheme != "http" && u.Scheme != "https") || u.AbsolutePath != "/" || u.Query != "" || u.Fragment != "" || u.UserInfo != ""))
    throw new InvalidOperationException("PRESTOP_ALLOWED_ORIGINS must contain explicit HTTP(S) origins.");
builder.Services.AddCors(options => options.AddPolicy("Kiosk", policy => policy.WithOrigins(origins).WithMethods("GET", "POST").WithHeaders("Content-Type")));
builder.Services.AddSingleton<Scanner>();
var app = builder.Build();
app.Use(async (context, next) =>
{
    context.Response.Headers.CacheControl = "no-store";
    if (context.Request.Headers.TryGetValue("Origin", out var origin) && !origins.Contains(origin.ToString(), StringComparer.Ordinal))
    { context.Response.StatusCode = 403; await context.Response.WriteAsJsonAsync(ScanResult.Fail("origin_denied", "Origin is not allowed.")); return; }
    await next();
});
app.UseCors("Kiosk");
app.MapGet("/api/scanner/status", (Scanner scanner) => Results.Ok(new { service = "online", initialized = scanner.Initialized, busy = scanner.Busy, lastCode = scanner.LastCode, architecture = System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture.ToString(), mode = "hardware" }));
async Task<IResult> Execute(Scanner scanner, bool scan)
{
    var result = await scanner.Execute(scan);
    int status = result.Success ? 200 : result.Code == "busy" ? 409 : result.Code == "document_timeout" ? 408 :
        result.Code is "invalid_mrz" or "no_mrz" or "unsupported_document" ? 422 : 503;
    return Results.Json(result, statusCode: status);
}
app.MapPost("/api/scanner/initialize", (Scanner scanner) => Execute(scanner, false));
app.MapPost("/api/scanner/scan", (Scanner scanner) => Execute(scanner, true));
app.Run();
