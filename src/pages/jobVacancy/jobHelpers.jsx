export const STATUS_OPTIONS = ["Any", "Active", "Pending Review", "Filled", "Closed"];
export const DEPARTMENTS = ["Any", "Engineering", "Product", "Design", "Analytics", "Marketing", "Sales"];
export const ITEMS_PER_PAGE = 7;

export const initialJobs = [
  { id: 1, title: "Senior Software Engineer", dept: "Engineering", pos: 3, apps: 24, date: "2024-01-15", status: "Active", description: "Looking for a React expert with 5+ years experience in building scalable web applications." },
  { id: 2, title: "Product Manager", dept: "Product", pos: 1, apps: 12, date: "2024-01-20", status: "Active", description: "Lead the roadmap for our core hiring platform." },
  { id: 3, title: "UI/UX Designer", dept: "Design", pos: 2, apps: 8, date: "2024-02-01", status: "Pending Review", description: "Design intuitive interfaces using Figma and conduct user research." },
  { id: 4, title: "Data Analyst", dept: "Analytics", pos: 1, apps: 5, date: "2023-12-10", status: "Filled", description: "Analyze recruitment trends and provide actionable insights." },
  { id: 5, title: "Marketing Manager", dept: "Marketing", pos: 1, apps: 0, date: "2023-11-01", status: "Closed", description: "Manage digital marketing campaigns and SEO." },
  { id: 6, title: "Junior Developer", dept: "Engineering", pos: 2, apps: 45, date: "2024-02-10", status: "Active", description: "Entry-level position for passionate coders." },
  { id: 7, title: "HR Specialist", dept: "Human Resources", pos: 1, apps: 10, date: "2024-02-12", status: "Active", description: "Handle employee relations and onboarding." },
  { id: 8, title: "Sales Executive", dept: "Sales", pos: 5, apps: 30, date: "2024-02-15", status: "Active", description: "Drive revenue growth through B2B sales." },
  { id: 9, title: "DevOps Engineer", dept: "Engineering", pos: 1, apps: 15, date: "2024-02-18", status: "Pending Review", description: "Manage CI/CD pipelines and cloud infrastructure." }
];

export const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-50 text-green-600 border-green-200';
    case 'Pending Review': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    case 'Filled': return 'bg-blue-50 text-blue-600 border-blue-200';
    default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};