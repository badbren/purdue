// Mock data shaped like the Supabase tables we'll create later.
// When Supabase is wired up, these types become the table rows and the
// arrays below get replaced with queries.

export const COMPANY = {
  name: "Perdue Construction",
  tagline: "Custom Trim & Finish Carpentry",
  phone: "(555) 123-4567", // TODO: real number
  email: "quotes@perdueconstruction.com", // TODO: real email
  serviceArea: "Serving the greater metro area",
};

export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  notes: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // e.g. "9:00 AM"
  status: AppointmentStatus;
  createdAt: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Invoice {
  id: string;
  number: string;
  customerName: string;
  jobDescription: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Expense {
  id: string;
  vendor: string;
  category: "materials" | "fuel" | "tools" | "subcontractor" | "other";
  description: string;
  amount: number;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string | null; // null = still clocked in
  jobSite: string;
  hours: number | null;
}

export const SERVICES = [
  {
    title: "Crown Molding & Trim",
    description:
      "Crown, baseboards, door and window casing — precision-cut interior finish carpentry with tight, seamless joints.",
  },
  {
    title: "Wainscoting & Accent Walls",
    description:
      "Board and batten, shiplap, picture-frame wainscoting — statement walls built to last.",
  },
  {
    title: "Cabinets & Vanities",
    description:
      "Custom cabinets and bathroom vanities built to fit your space — not the other way around.",
  },
  {
    title: "Mantles & Fireplace Surrounds",
    description:
      "Statement mantles and fireplace surrounds, from rustic beams to full floor-to-ceiling custom builds.",
  },
  {
    title: "Drop Zones & Built-Ins",
    description:
      "Mudroom drop zones, lockers, benches, bookcases, and built-in storage that tames the daily chaos.",
  },
  {
    title: "Custom Woodwork",
    description:
      "If you can picture it, we can build it. Everything custom-built to fit — replace, remodel, or first-time install.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah M.",
    text: "The crown molding completely transformed our living room. Tight joints, clean caulk lines, and they left the place spotless. Couldn't recommend them more.",
    project: "Crown molding, whole first floor",
  },
  {
    name: "James T.",
    text: "Ricky and his crew built us a wall of built-ins around the fireplace. It looks like it came with the house. Fair price, showed up when they said they would.",
    project: "Custom built-ins",
  },
  {
    name: "Danielle R.",
    text: "We had board and batten done in the entryway and dining room. The attention to detail is unreal — every line is perfect. Already booked them for the bedrooms.",
    project: "Wainscoting & accent walls",
  },
];

// ---- Mock rows (replaced by Supabase later) ----

export const APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    customerName: "Mike Henderson",
    phone: "(555) 201-3344",
    email: "mike.h@email.com",
    address: "412 Maplewood Dr",
    service: "Crown Molding",
    notes: "Living room + dining room, ~600 sq ft total. Vaulted ceiling in living room.",
    date: "2026-07-21",
    time: "9:00 AM",
    status: "confirmed",
    createdAt: "2026-07-15",
  },
  {
    id: "apt-2",
    customerName: "Lisa Carter",
    phone: "(555) 887-1290",
    email: "lcarter@email.com",
    address: "88 Birch Hollow Ln",
    service: "Custom Built-Ins",
    notes: "Wants fireplace surround built-ins with floating shelves.",
    date: "2026-07-21",
    time: "1:30 PM",
    status: "confirmed",
    createdAt: "2026-07-16",
  },
  {
    id: "apt-3",
    customerName: "Tom Alvarez",
    phone: "(555) 440-9987",
    email: "t.alvarez@email.com",
    address: "1509 Ridgeline Ct",
    service: "Wainscoting & Accent Walls",
    notes: "Board and batten in entryway and up the stairwell.",
    date: "2026-07-23",
    time: "10:00 AM",
    status: "requested",
    createdAt: "2026-07-19",
  },
  {
    id: "apt-4",
    customerName: "Rachel Nguyen",
    phone: "(555) 332-7160",
    email: "rnguyen@email.com",
    address: "27 Fox Run Rd",
    service: "Doors & Hardware",
    notes: "6 interior doors replaced, wants matte black hardware.",
    date: "2026-07-24",
    time: "8:30 AM",
    status: "requested",
    createdAt: "2026-07-19",
  },
  {
    id: "apt-5",
    customerName: "Dan Brooks",
    phone: "(555) 118-4452",
    email: "dbrooks@email.com",
    address: "301 Charleston Ave",
    service: "Stairs & Railings",
    notes: "Replace iron balusters, refinish handrail.",
    date: "2026-07-28",
    time: "11:00 AM",
    status: "confirmed",
    createdAt: "2026-07-17",
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "inv-1",
    number: "INV-1042",
    customerName: "Henderson Residence",
    jobDescription: "Crown molding — living & dining",
    amount: 3850,
    issuedDate: "2026-07-10",
    dueDate: "2026-07-24",
    status: "sent",
  },
  {
    id: "inv-2",
    number: "INV-1041",
    customerName: "Carter Residence",
    jobDescription: "Fireplace built-ins",
    amount: 7200,
    issuedDate: "2026-07-02",
    dueDate: "2026-07-16",
    status: "overdue",
  },
  {
    id: "inv-3",
    number: "INV-1040",
    customerName: "Wilson Remodel",
    jobDescription: "Baseboards & casing, whole house",
    amount: 5400,
    issuedDate: "2026-06-24",
    dueDate: "2026-07-08",
    status: "paid",
  },
  {
    id: "inv-4",
    number: "INV-1039",
    customerName: "Alvarez Residence",
    jobDescription: "Entryway board & batten",
    amount: 2150,
    issuedDate: "2026-06-18",
    dueDate: "2026-07-02",
    status: "paid",
  },
];

export const EXPENSES: Expense[] = [
  {
    id: "exp-1",
    vendor: "Builders Supply Co",
    category: "materials",
    description: "Primed MDF crown, 16ft sticks x24",
    amount: 612.4,
    date: "2026-07-14",
  },
  {
    id: "exp-2",
    vendor: "Shell",
    category: "fuel",
    description: "Truck fuel",
    amount: 88.5,
    date: "2026-07-15",
  },
  {
    id: "exp-3",
    vendor: "Hardware Depot",
    category: "tools",
    description: "18ga brad nails, glue, caulk case",
    amount: 146.22,
    date: "2026-07-16",
  },
  {
    id: "exp-4",
    vendor: "Builders Supply Co",
    category: "materials",
    description: "3/4 birch ply x12 sheets (Carter built-ins)",
    amount: 947.88,
    date: "2026-07-17",
  },
];

export const EMPLOYEES: Employee[] = [
  { id: "emp-1", name: "Ricky Perdue", role: "Owner / Lead Carpenter", hourlyRate: 0 },
  { id: "emp-2", name: "Alex", role: "Trim Carpenter", hourlyRate: 28 },
];

export const TIME_ENTRIES: TimeEntry[] = [
  {
    id: "te-1",
    employeeId: "emp-2",
    date: "2026-07-16",
    clockIn: "7:02 AM",
    clockOut: "3:34 PM",
    jobSite: "Wilson Remodel",
    hours: 8.5,
  },
  {
    id: "te-2",
    employeeId: "emp-2",
    date: "2026-07-17",
    clockIn: "6:58 AM",
    clockOut: "3:12 PM",
    jobSite: "Carter Residence",
    hours: 8.2,
  },
  {
    id: "te-3",
    employeeId: "emp-2",
    date: "2026-07-18",
    clockIn: "7:15 AM",
    clockOut: "1:45 PM",
    jobSite: "Carter Residence",
    hours: 6.5,
  },
];

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
