// Demo delivery data. Replace with a real lookup API later.
export const deliveries = [
  {
    reference: "DEL-2026-00152",
    driver: "John Smith",
    company: "Demo Transport B.V.",
    warehouse: "Warehouse A",
    dock: "04",
    order: "PO-58421",
    status: "Expected",
  },
  {
    reference: "DEL-2026-00241",
    driver: "Michael Brown",
    company: "European Freight Logistics",
    warehouse: "Warehouse B",
    dock: "07",
    order: "PO-60182",
    status: "Expected",
  },
  {
    reference: "DEL-2026-00318",
    driver: "Thomas Müller",
    company: "Continental Transport GmbH",
    warehouse: "Warehouse A",
    dock: "02",
    order: "PO-61744",
    status: "Expected",
  },
];

export function findDelivery(reference) {
  return deliveries.find((d) => d.reference === reference);
}

export default deliveries;