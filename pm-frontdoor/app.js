const actions = [
  {
    column: "Overdue",
    count: 2,
    tone: "red",
    items: [
      {
        type: "Project Status Report",
        title: "Submit Vision 2030 weekly report",
        project: "Vision 2030",
        meta: "Overdue by 5 days",
        owner: "SA",
        cta: "Submit",
        progress: 18,
      },
      {
        type: "Risk Escalation",
        title: "Budget overrun response",
        project: "NEOM Integration",
        meta: "High priority",
        owner: "AH",
        cta: "Resolve",
        progress: 55,
      },
    ],
  },
  {
    column: "This week",
    count: 2,
    tone: "blue",
    items: [
      {
        type: "Dependency",
        title: "Confirm API dependency owner",
        project: "Smart City Alpha",
        meta: "Due today",
        owner: "FA",
        cta: "Chase",
        progress: 42,
      },
      {
        type: "Benefit",
        title: "Benefits owner response",
        project: "Smart City Alpha",
        meta: "Due in 2 days",
        owner: "FA",
        cta: "Review",
        progress: 74,
      },
    ],
  },
  {
    column: "Upcoming",
    count: 2,
    tone: "amber",
    items: [
      {
        type: "Milestone",
        title: "Execution gate readiness",
        project: "Vision 2030",
        meta: "Due Jun 12",
        owner: "MH",
        cta: "Open",
        progress: 54,
      },
      {
        type: "Risk",
        title: "Initial RAID refresh",
        project: "NEOM Integration",
        meta: "Next week",
        owner: "AH",
        cta: "Plan",
        progress: 35,
      },
    ],
  },
];

const projects = [
  { id: "all", name: "All projects" },
  { id: "UAE Research Map", name: "UAE Research Map" },
  { id: "Global Anti-Scam Taskforce", name: "Global Anti-Scam Taskforce" },
  { id: "Counter Terrorism Operations", name: "Counter Terrorism Operations" },
  { id: "Vision 2030", name: "Vision 2030" },
  { id: "NEOM Integration", name: "NEOM Integration" },
  { id: "Smart City Alpha", name: "Smart City Alpha" },
  { id: "PMO Capability", name: "PMO Capability" },
];

const projectPlaygroundDetails = {
  "UAE Research Map": {
    owner: "Muna Hassan",
    stage: "Initiation",
    budget: "SAR 3.6M",
    nextGate: "Jun 12",
    health: "Setup",
  },
  "Vision 2030": {
    owner: "Muna Hassan",
    stage: "Execution",
    budget: "SAR 4.8M",
    nextGate: "Jun 12",
    health: "Attention",
  },
  "NEOM Integration": {
    owner: "Ahmed Hadi",
    stage: "Planning",
    budget: "SAR 2.1M",
    nextGate: "May 28",
    health: "At risk",
  },
  "Smart City Alpha": {
    owner: "Fatima Ali",
    stage: "Execution",
    budget: "SAR 3.4M",
    nextGate: "Jul 18",
    health: "On track",
  },
  "PMO Capability": {
    owner: "Muna Hassan",
    stage: "Initiation",
    budget: "SAR 1.2M",
    nextGate: "Jun 04",
    health: "On track",
  },
};

const playgroundRelationshipTypes = [
  {
    id: "benefits",
    label: "Benefits",
    singular: "benefit",
    icon: "benefit",
    tone: "green",
    hint: "Outcomes, measures, owners",
  },
  {
    id: "risks",
    label: "Risks",
    singular: "risk",
    icon: "risks",
    tone: "red",
    hint: "Threats and mitigations",
  },
  {
    id: "issues",
    label: "Issues",
    singular: "issue",
    icon: "issues",
    tone: "red",
    hint: "Open decisions and blockers",
  },
  {
    id: "lessons",
    label: "Lessons learnt",
    singular: "lesson",
    icon: "lessons",
    tone: "blue",
    hint: "Reusable delivery learning",
  },
  {
    id: "management-products",
    label: "Management products",
    singular: "management product",
    icon: "management",
    tone: "neutral",
    hint: "Plans, registers, reports",
  },
  {
    id: "end-products",
    label: "End products",
    singular: "end product",
    icon: "endProduct",
    tone: "green",
    hint: "Outputs handed to users",
  },
  {
    id: "milestones",
    label: "Milestones",
    singular: "milestone",
    icon: "milestone",
    tone: "amber",
    hint: "Gates and delivery dates",
  },
  {
    id: "dependencies",
    label: "Dependencies",
    singular: "dependency",
    icon: "dependencies",
    tone: "blue",
    hint: "Incoming and outgoing links",
  },
  {
    id: "stakeholders",
    label: "Stakeholders",
    singular: "stakeholder",
    icon: "resources",
    tone: "neutral",
    hint: "Sponsors, owners, reviewers",
  },
];

const notifications = [
  {
    title: "Vision 2030 status report is overdue",
    detail: "Due 5 days ago. Submit the weekly update before the next steering check.",
    time: "12 min",
    tone: "red",
    icon: "alert",
    unread: true,
  },
  {
    title: "Stage gate checklist ready",
    detail: "3 of 5 items are complete for the Execution gate.",
    time: "1 hr",
    tone: "blue",
    icon: "stageGate",
    unread: true,
  },
  {
    title: "Benefits owner response received",
    detail: "Smart City Alpha has a new owner note for review.",
    time: "Today",
    tone: "green",
    icon: "check",
    unread: false,
  },
  {
    title: "PMO forum pack due this week",
    detail: "Prepare the capability pack before Friday.",
    time: "May 15",
    tone: "neutral",
    icon: "calendar",
    unread: false,
  },
];

const aiWorkspaceInsights = [
  {
    tone: "red",
    label: "Needs attention",
    title: "Submit Vision 2030 status report",
    body: "Overdue by 5 days. Clear this before the next steering check.",
    source: "Reporting trends",
    cta: "Create report",
    action: { type: "report", project: "Vision 2030" },
  },
  {
    tone: "blue",
    label: "Recommended flow",
    title: "Use board view to chase owners",
    body: "Calendar shows timing; board view shows who needs follow-up this week.",
    source: "Actions workspace",
    cta: "Open board",
    action: { type: "view", view: "board" },
  },
  {
    tone: "amber",
    label: "Resource plan",
    title: "Time to change your resource plan",
    body: "Resource demand has shifted. Review capacity before the next delivery update.",
    source: "Resources",
    cta: "Review resources",
    action: { type: "view", view: "resources" },
  },
  {
    tone: "amber",
    label: "Gate readiness",
    title: "Execution gate needs evidence",
    body: "Vision 2030 is 3 of 5 ready. Attach the remaining evidence before Jun 12.",
    source: "Stage gates",
    cta: "Open gate",
    action: { type: "stageGate", project: "Vision 2030", stage: "execution" },
  },
  {
    tone: "green",
    label: "PMO update",
    title: "Review unread notifications",
    body: "Two PMO updates are still unread, including a gate checklist change.",
    source: "Notifications",
    cta: "Review",
    action: { type: "notifications" },
  },
];

const timelineItems = [
  { date: "2026-04-28", label: "Status report", tone: "red", project: "Vision 2030", kind: "report" },
  { date: "2026-05-04", label: "PMO pack", tone: "green", project: "PMO Capability", kind: "management-product" },
  { date: "2026-05-06", label: "Benefit baseline", tone: "green", project: "Vision 2030", kind: "benefit" },
  { date: "2026-05-09", label: "Status report", tone: "red", project: "Vision 2030", kind: "report" },
  { date: "2026-05-10", label: "Budget risk", tone: "red", project: "NEOM Integration", kind: "risk" },
  { date: "2026-05-15", label: "Forum pack", tone: "neutral", project: "PMO Capability", kind: "management-product" },
  { date: "2026-05-19", label: "API dependency", tone: "red", project: "Smart City Alpha", kind: "dependency" },
  { date: "2026-05-22", label: "Product evidence", tone: "neutral", project: "Vision 2030", kind: "end-product" },
  { date: "2026-05-25", label: "CSAT target", tone: "blue", project: "Smart City Alpha", kind: "benefit" },
  { date: "2026-05-29", label: "Benefits review", tone: "blue", project: "Smart City Alpha", kind: "benefit" },
  { date: "2026-06-12", label: "Execution gate", tone: "amber", project: "Vision 2030", kind: "milestone" },
  { date: "2026-06-18", label: "Dependency review", tone: "blue", project: "Smart City Alpha", kind: "dependency" },
  { date: "2026-07-01", label: "Benefits kickoff", tone: "green", project: "Smart City Alpha", kind: "benefit" },
  { date: "2026-08-10", label: "RAID refresh", tone: "amber", project: "NEOM Integration", kind: "risk" },
  { date: "2026-09-08", label: "Closure gate", tone: "amber", project: "Vision 2030", kind: "milestone" },
  { date: "2026-10-05", label: "PMO rollout", tone: "green", project: "PMO Capability", kind: "management-product" },
];

const projectQuickActions = [
  {
    title: "Project plan",
    icon: "plan",
    page: "project-plan",
  },
  {
    title: "WBS",
    icon: "wbs",
    page: "wbs",
  },
  {
    title: "Stage gate",
    icon: "stageGate",
  },
  {
    title: "Change request",
    icon: "changeRequest",
  },
  {
    title: "Dependencies",
    icon: "dependencies",
  },
  {
    title: "Resources",
    icon: "resources",
  },
  {
    title: "Risks",
    icon: "risks",
  },
  {
    title: "Issues",
    icon: "issues",
  },
  {
    title: "Project closure",
    icon: "closure",
  },
  {
    title: "Lessons learnt",
    icon: "lessons",
  },
];

const wbsProjectDetails = {
  "Vision 2030": {
    title: "Vision 2030",
    stage: "Execution",
    state: "Active",
    progress: 32,
    owner: "Muna Hassan",
    start: "2024-01-01",
    end: "2024-12-18",
  },
  "NEOM Integration": {
    title: "NEOM Integration",
    stage: "Planning",
    state: "Active",
    progress: 18,
    owner: "Ahmed Hadi",
    start: "2024-01-08",
    end: "2024-10-30",
  },
  "Smart City Alpha": {
    title: "Smart City Alpha",
    stage: "Execution",
    state: "Active",
    progress: 41,
    owner: "Fatima Ali",
    start: "2024-02-01",
    end: "2024-12-05",
  },
  "PMO Capability": {
    title: "PMO Capability",
    stage: "Initiation",
    state: "Active",
    progress: 12,
    owner: "Muna Hassan",
    start: "2024-01-15",
    end: "2024-09-27",
  },
};

const baseWbsItems = [
  {
    id: "project",
    code: "",
    title: "Vision 2030",
    type: "Project",
    owner: "Muna Hassan",
    level: 0,
    start: "2024-01-01",
    end: "2024-12-18",
    progress: 32,
    status: "active",
  },
  {
    id: "mandate",
    parent: "project",
    code: "1",
    title: "Baselined Project Plan",
    type: "Management Product",
    owner: "Sophia Brown",
    level: 1,
    start: "2024-01-05",
    end: "2024-02-08",
    progress: 0,
    status: "late",
  },
  {
    id: "kickoff",
    parent: "mandate",
    code: "1.1",
    title: "Project Kick-off",
    type: "Milestone",
    owner: "Sophia Brown",
    level: 2,
    date: "2024-01-09",
    progress: 100,
    status: "done",
  },
  {
    id: "baseline",
    parent: "mandate",
    code: "1.2",
    title: "Benefits baseline evidence",
    type: "Management Product",
    owner: "Muna Hassan",
    level: 2,
    start: "2024-01-18",
    end: "2024-02-28",
    progress: 45,
    status: "active",
  },
  {
    id: "closure-report",
    parent: "project",
    code: "2",
    title: "Project Closure Report",
    type: "Management Product",
    owner: "Sophia Brown",
    level: 1,
    start: "2024-02-16",
    end: "2024-03-22",
    progress: 0,
    status: "late",
  },
  {
    id: "close-gate",
    parent: "closure-report",
    code: "2.1",
    title: "Project Closure",
    type: "Milestone",
    owner: "Sophia Brown",
    level: 2,
    date: "2024-02-05",
    progress: 100,
    status: "done",
  },
  {
    id: "service-portal",
    parent: "project",
    code: "3",
    title: "Citizen Service Portal",
    type: "End Product",
    owner: "Muna Hassan",
    level: 1,
    start: "2024-03-01",
    end: "2024-06-24",
    progress: 38,
    status: "active",
  },
  {
    id: "api-spec",
    parent: "service-portal",
    code: "3.1",
    title: "API integration specification",
    type: "Management Product",
    owner: "Fatima Ali",
    level: 2,
    start: "2024-03-12",
    end: "2024-04-19",
    progress: 54,
    status: "active",
  },
  {
    id: "uat-evidence",
    parent: "service-portal",
    code: "3.2",
    title: "UAT evidence pack",
    type: "Management Product",
    owner: "Fatima Ali",
    level: 2,
    start: "2024-05-06",
    end: "2024-06-14",
    progress: 18,
    status: "planned",
  },
  {
    id: "pmo-pack",
    parent: "project",
    code: "4",
    title: "PMO forum pack",
    type: "Management Product",
    owner: "Muna Hassan",
    level: 1,
    start: "2024-04-08",
    end: "2024-05-06",
    progress: 68,
    status: "active",
  },
  {
    id: "execution-gate",
    parent: "project",
    code: "5",
    title: "Execution stage gate",
    type: "Stage Gate",
    owner: "Muna Hassan",
    level: 1,
    date: "2024-06-12",
    progress: 0,
    status: "planned",
  },
];

const reportCards = [
  ["Status reports", "3 due this week", "72% complete"],
  ["Risk posture", "2 high risks", "Needs response"],
  ["Benefits", "5 tracked", "2 pending owners"],
];

const timelineRows = [
  { title: "Project status report", project: "Vision 2030", start: "2026-04-28", end: "2026-05-15", tone: "red" },
  { title: "Budget overrun response", project: "NEOM Integration", start: "2026-05-04", end: "2026-05-13", tone: "red" },
  { title: "API dependency", project: "Smart City Alpha", start: "2026-05-07", end: "2026-05-20", tone: "blue" },
  { title: "Forum pack", project: "PMO Capability", start: "2026-05-12", end: "2026-05-23", tone: "blue" },
  { title: "Benefits review", project: "Smart City Alpha", start: "2026-07-01", end: "2026-08-14", tone: "green" },
  { title: "Closure gate", project: "Vision 2030", start: "2026-09-08", end: "2026-10-18", tone: "amber" },
  { title: "RAID refresh", project: "NEOM Integration", start: "2026-08-10", end: "2026-09-14", tone: "amber" },
  { title: "PMO capability rollout", project: "PMO Capability", start: "2026-10-05", end: "2026-12-11", tone: "green" },
  { title: "Strategy baseline", project: "Vision 2030", start: "2025-10-06", end: "2026-02-16", tone: "green" },
  { title: "Pilot delivery window", project: "Smart City Alpha", start: "2026-11-02", end: "2027-03-31", tone: "blue" },
  { title: "Integration closure", project: "NEOM Integration", start: "2026-12-14", end: "2027-05-28", tone: "amber" },
];

const stageDefinitions = [
  { id: "initiation", label: "Initiation", gate: "Initiation gate" },
  { id: "planning", label: "Planning", gate: "Planning gate" },
  { id: "execution", label: "Execution", gate: "Execution gate" },
  { id: "closure", label: "Closure", gate: "Closure gate" },
];

const projectStageProfiles = [
  {
    project: "Vision 2030",
    currentStage: 2,
    tone: "green",
    gateDue: "Jun 12",
    gateDone: 3,
    gateTotal: 5,
    checkpoint: "Benefits baseline and status report evidence",
    checklist: ["Scope narrative updated", "RAID log reviewed", "Benefits baseline attached", "Sponsor sign-off drafted", "Next-stage owners assigned"],
  },
  {
    project: "NEOM Integration",
    currentStage: 1,
    tone: "amber",
    gateDue: "May 24",
    gateDone: 2,
    gateTotal: 5,
    checkpoint: "Budget response and dependency reset",
    checklist: ["Commercial risk response added", "Dependency owner confirmed", "Integration plan refreshed", "Finance approval requested", "Steering note prepared"],
  },
  {
    project: "Smart City Alpha",
    currentStage: 2,
    tone: "blue",
    gateDue: "May 29",
    gateDone: 4,
    gateTotal: 5,
    checkpoint: "Product evidence and benefits owner response",
    checklist: ["Pilot evidence uploaded", "API dependency closed", "Benefits owner confirmed", "Acceptance criteria checked", "Go-forward decision captured"],
  },
  {
    project: "PMO Capability",
    currentStage: 1,
    tone: "green",
    gateDue: "May 15",
    gateDone: 3,
    gateTotal: 4,
    checkpoint: "Forum pack and rollout plan",
    checklist: ["Forum pack complete", "Training audience confirmed", "Playbook draft linked", "Rollout risks logged"],
  },
];

const reportStatusHistory = [
  {
    project: "UAE Research Map",
    cadence: "Weekly",
    lastSubmitted: "May 3, 2026",
    nextDue: "Today",
    dueLabel: "Due today",
    dueTone: "amber",
    summary: "Initiation PSR needs scope alignment, stakeholder mapping, and baseline planning evidence.",
    trend: [
      { label: "Jan", status: "submitted" },
      { label: "Feb", status: "submitted" },
      { label: "Mar", status: "submitted" },
      { label: "Apr", status: "attention" },
      { label: "May", status: "due" },
    ],
  },
  {
    project: "Vision 2030",
    cadence: "Weekly",
    lastSubmitted: "May 2, 2026",
    nextDue: "Today",
    dueLabel: "Overdue 5 days",
    dueTone: "red",
    summary: "Weekly PSR needs the latest delivery progress and steering risks.",
    trend: [
      { label: "Jan", status: "submitted" },
      { label: "Feb", status: "submitted" },
      { label: "Mar", status: "attention" },
      { label: "Apr", status: "submitted" },
      { label: "May", status: "overdue" },
    ],
  },
  {
    project: "NEOM Integration",
    cadence: "Weekly",
    lastSubmitted: "Apr 30, 2026",
    nextDue: "Today",
    dueLabel: "Due today",
    dueTone: "amber",
    summary: "Budget response and dependency reset should be reflected in this PSR.",
    trend: [
      { label: "Jan", status: "submitted" },
      { label: "Feb", status: "missed" },
      { label: "Mar", status: "attention" },
      { label: "Apr", status: "submitted" },
      { label: "May", status: "due" },
    ],
  },
  {
    project: "Smart City Alpha",
    cadence: "Bi-weekly",
    lastSubmitted: "May 6, 2026",
    nextDue: "May 19",
    dueLabel: "On track",
    dueTone: "green",
    summary: "Capture benefits owner decision and API dependency closure evidence.",
    trend: [
      { label: "Jan", status: "submitted" },
      { label: "Feb", status: "submitted" },
      { label: "Mar", status: "attention" },
      { label: "Apr", status: "submitted" },
      { label: "May", status: "submitted" },
    ],
  },
  {
    project: "PMO Capability",
    cadence: "Monthly",
    lastSubmitted: "May 1, 2026",
    nextDue: "May 15",
    dueLabel: "Due this week",
    dueTone: "amber",
    summary: "Forum pack progress and rollout risks are ready for the next report.",
    trend: [
      { label: "Jan", status: "submitted" },
      { label: "Feb", status: "submitted" },
      { label: "Mar", status: "submitted" },
      { label: "Apr", status: "submitted" },
      { label: "May", status: "draft" },
    ],
  },
];

const reportCreationDetails = {
  "UAE Research Map": {
    intervalStart: "30/04/2026",
    intervalEnd: "29/05/2026",
    intervalStatus: "Not created",
    stage: "Initiation",
    state: "Active",
    overallTrend: "Needs attention",
    progress: 20,
    baselineEnd: "31/12/2026",
    forecastEnd: "31/12/2026",
    comments: "Initiation is active. Scope, stakeholder alignment, and plan evidence need to be captured for the first reporting cycle.",
    achievements: "Project assignment accepted. Initial outcomes, capabilities, and sponsor context are being drafted.",
    planned: "Complete baseline planning, confirm research owners, and prepare initiation gate evidence for PMO review.",
  },
  "Vision 2030": {
    intervalStart: "30/04/2026",
    intervalEnd: "29/05/2026",
    intervalStatus: "Not created",
    stage: "Execution",
    state: "Active",
    overallTrend: "Improving",
    progress: 11.6,
    baselineEnd: "31/12/2026",
    forecastEnd: "31/12/2026",
    comments: "Delivery remains active. Latest steering risks and benefits evidence need to be reflected before submission.",
    achievements: "Benefits baseline attached. Sponsor note drafted. Status report evidence is pending final review.",
    planned: "Confirm sponsor sign-off, close RAID updates, and prepare next-stage owners for the execution checkpoint.",
  },
  "NEOM Integration": {
    intervalStart: "30 Apr 2026",
    intervalEnd: "29 May 2026",
    intervalStatus: "Not created",
    stage: "Planning",
    state: "Active",
    overallTrend: "Needs attention",
    progress: 45,
    baselineEnd: "30 Sep 2026",
    forecastEnd: "15 Oct 2026",
    comments: "Budget response and dependency reset are the main items for this reporting period.",
    achievements: "Dependency owner identified. Finance approval route confirmed.",
    planned: "Update integration plan, attach risk response, and brief the steering group on revised dates.",
  },
  "Smart City Alpha": {
    intervalStart: "06 May 2026",
    intervalEnd: "19 May 2026",
    intervalStatus: "Draft due",
    stage: "Execution",
    state: "Active",
    overallTrend: "Stable",
    progress: 82,
    baselineEnd: "31 Mar 2027",
    forecastEnd: "31 Mar 2027",
    comments: "Pilot evidence and benefits owner decisions are ready for the report.",
    achievements: "Acceptance criteria checked. API dependency closure evidence uploaded.",
    planned: "Complete benefits review and prepare the next pilot readiness pack.",
  },
  "PMO Capability": {
    intervalStart: "01 May 2026",
    intervalEnd: "31 May 2026",
    intervalStatus: "Draft due",
    stage: "Planning",
    state: "Active",
    overallTrend: "Stable",
    progress: 64,
    baselineEnd: "31 Dec 2026",
    forecastEnd: "31 Dec 2026",
    comments: "Forum pack progress and rollout risks are ready for the next management update.",
    achievements: "Training audience confirmed. Playbook draft linked.",
    planned: "Publish rollout pack and confirm PMO forum actions.",
  },
};

const timelineRangeOptions = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
  { id: "year", label: "Year" },
  { id: "lifetime", label: "Lifetime" },
];

const boardFilters = [
  { id: "all", label: "All", icon: "grid" },
  { id: "report", label: "Reports", icon: "plan" },
  { id: "risk", label: "Risks", icon: "risks" },
  { id: "task", label: "Task", icon: "checklist" },
  { id: "milestone", label: "Milestone", icon: "milestone" },
  { id: "end-product", label: "End product", icon: "endProduct" },
  { id: "management-product", label: "Management product", icon: "management" },
  { id: "issue", label: "Issues", icon: "issues" },
  { id: "benefit", label: "Benefit", icon: "benefit" },
  { id: "dependency", label: "Dependency", icon: "dependencies" },
];

const unassignedJourneySteps = [
  {
    title: "Project assigned",
    body: "You’ll receive a PMO assignment notification.",
    icon: "bell",
  },
  {
    title: "Build project plan",
    body: "Set scope, timeline, risks, and dependencies.",
    icon: "plan",
  },
  {
    title: "Submit for approval",
    body: "Send your baseline for PMO review and endorsement.",
    icon: "stageGate",
  },
  {
    title: "Manage delivery",
    body: "Track milestones, issues, and dependencies.",
    icon: "playground",
  },
  {
    title: "Report progress",
    body: "Submit PSRs and maintain delivery health.",
    icon: "chart",
  },
];

const firstAssignedProject = {
  id: "UAE Research Map",
  name: "UAE Research Map",
  stage: "Initiation",
  owner: "Muna Hassan",
  planDue: "Jun 12",
};

const workspaceProjectCards = [
  {
    code: "ATRC-01",
    title: "UAE Research Map",
    stage: "Initiation stage",
    status: "On Track",
    statusTone: "green",
    schedule: 72,
    scheduleNote: "last 5 PSRs",
    scheduleDelta: "",
    budgetUsed: "$125K",
    budgetTotal: "$320K",
    budget: 39,
    budgetNote: "39%, well within threshold",
    nextDue: "01 Jun 2026 · 3 days",
    action: "Submit PSR",
    reportProject: "UAE Research Map",
  },
  {
    code: "ATRC-01",
    title: "Global Anti-Scam Taskforce",
    stage: "Closure stage",
    status: "On Track",
    statusTone: "green",
    schedule: 41,
    scheduleNote: "",
    scheduleDelta: "2% behind plan this period",
    scheduleTone: "red",
    budgetUsed: "$125K",
    budgetTotal: "$320K",
    budget: 39,
    budgetNote: "39%, well within threshold",
    nextDue: "01 Jun 2026 · 3 days",
    action: "Open Project",
  },
  {
    code: "ATRC-01",
    title: "Counter Terrorism Operations",
    stage: "Execution stage",
    status: "At Risk",
    statusTone: "amber",
    schedule: 82,
    scheduleNote: "",
    scheduleDelta: "3% ahead of plan",
    scheduleTone: "green",
    budgetUsed: "$125K",
    budgetTotal: "$320K",
    budget: 39,
    budgetNote: "39%, well within threshold",
    nextDue: "01 Jun 2026 · 3 days",
    action: "Submit PSR",
    reportProject: "UAE Research Map",
  },
  {
    code: "ATRC-01",
    title: "Counter Terrorism Operations",
    stage: "Draft",
    draft: true,
    nextDue: "Plan not yet created",
    action: "Create",
  },
];

const workspaceTrendRows = [
  { project: "UAE Research Map", statuses: ["red", "amber", "green"] },
  { project: "Global Anti-Scam Taskforce", statuses: ["green", "green", "amber"] },
  { project: "NEOM Integration", statuses: ["amber", "red", "green"] },
  { project: "Vision 2030", statuses: ["red", "green", "red"] },
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const PLAYGROUND_PREVIEW_LIMIT = 3;
const WBS_TIMELINE_START = "2024-01-01";
const WBS_TIMELINE_END = "2024-12-31";
const WBS_MONTH_WIDTH = 207;
const WBS_QUARTER_WIDTH = 330;

function isAllProjects(projectId) {
  return projectId === "all";
}

function projectName(projectId) {
  return projects.find((project) => project.id === projectId)?.name || projectId || "All projects";
}

function wbsProjectId(projectId) {
  return isAllProjects(projectId) ? "Vision 2030" : projectId;
}

function wbsProjectMeta(projectId) {
  const project = wbsProjectId(projectId);
  const details = projectPlaygroundDetails[project] || projectPlaygroundDetails["Vision 2030"];
  return (
    wbsProjectDetails[project] || {
      title: project,
      stage: details.stage,
      state: "Active",
      progress: 20,
      owner: details.owner,
      start: WBS_TIMELINE_START,
      end: WBS_TIMELINE_END,
    }
  );
}

function playgroundProjectId(projectId) {
  return isAllProjects(projectId) ? "Vision 2030" : projectId;
}

function playgroundProjectDetails(projectId) {
  return projectPlaygroundDetails[playgroundProjectId(projectId)] || projectPlaygroundDetails["Vision 2030"];
}

function playgroundType(typeId) {
  return playgroundRelationshipTypes.find((type) => type.id === typeId) || playgroundRelationshipTypes[0];
}

function matchesProject(projectId, itemProject) {
  return isAllProjects(projectId) || itemProject === projectId;
}

function actionKind(type) {
  const normalized = type.toLowerCase();
  if (normalized.includes("management product")) return "management-product";
  if (normalized.includes("end product")) return "end-product";
  if (normalized.includes("dependency")) return "dependency";
  if (normalized.includes("benefit")) return "benefit";
  if (normalized.includes("risk")) return "risk";
  if (normalized.includes("issue")) return "issue";
  if (normalized.includes("milestone") || normalized.includes("stage gate") || normalized.includes("gate")) return "milestone";
  if (normalized.includes("report")) return "report";
  if (normalized.includes("task") || normalized.includes("action")) return "task";
  return "task";
}

function filterKind(item) {
  return item.kind || actionKind(item.type || item.label || "");
}

function matchesWorkFilter(filter, item) {
  return filter === "all" || filterKind(item) === filter;
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function toDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameMonth(first, second) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

function daysBetween(start, end) {
  return Math.round((toDateOnly(end) - toDateOnly(start)) / MS_PER_DAY);
}

function clampDate(date, start, end) {
  if (date < start) return start;
  if (date > end) return end;
  return date;
}

function startOfWeek(date) {
  const current = toDateOnly(date);
  const day = current.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  return addDays(current, offset);
}

function startOfQuarter(date) {
  const month = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), month, 1);
}

function endOfQuarter(date) {
  const month = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), month + 3, 0);
}

function formatMonthDay(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatDateRange(start, end) {
  return `${formatMonthDay(start)} - ${formatMonthDay(end)}`;
}

function formatFullDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wbsRawItems(projectId) {
  const project = wbsProjectId(projectId);
  const meta = wbsProjectMeta(project);
  const offsetByProject = {
    "Vision 2030": 0,
    "NEOM Integration": 12,
    "Smart City Alpha": 28,
    "PMO Capability": 18,
  };
  const offset = offsetByProject[project] || 0;
  return baseWbsItems.map((item) => {
    const next = {
      ...item,
      title: item.id === "project" ? meta.title : item.title,
      owner: item.owner === "Muna Hassan" ? meta.owner : item.owner,
    };
    if (item.start) next.start = dateKey(addDays(parseDate(item.start), offset));
    if (item.end) next.end = dateKey(addDays(parseDate(item.end), offset));
    if (item.date) next.date = dateKey(addDays(parseDate(item.date), offset));
    if (item.id === "project") {
      next.start = meta.start || next.start;
      next.end = meta.end || next.end;
      next.progress = meta.progress;
    }
    return next;
  });
}

function wbsItemStart(item) {
  return parseDate(item.start || item.date || WBS_TIMELINE_START);
}

function wbsItemEnd(item) {
  return parseDate(item.end || item.date || item.start || WBS_TIMELINE_START);
}

function normalizeWbsItems(projectId) {
  const rawItems = wbsRawItems(projectId);
  const byId = new Map(rawItems.map((item) => [item.id, { ...item, childIds: [] }]));
  byId.forEach((item) => {
    if (item.parent && byId.has(item.parent)) {
      byId.get(item.parent).childIds.push(item.id);
    }
  });

  const resolve = (item) => {
    if (!item || item.resolved) return item;
    const children = item.childIds.map((id) => resolve(byId.get(id))).filter(Boolean);
    if (children.length && item.id !== "project") {
      const starts = children.map(wbsItemStart);
      const ends = children.map(wbsItemEnd);
      item.start = item.start || dateKey(new Date(Math.min(...starts.map((date) => date.getTime()))));
      item.end = item.end || dateKey(new Date(Math.max(...ends.map((date) => date.getTime()))));
      if (item.progress == null) {
        const weighted = children.reduce(
          (total, child) => {
            const days = Math.max(1, daysBetween(wbsItemStart(child), wbsItemEnd(child)) + 1);
            return {
              value: total.value + days * (child.progress || 0),
              days: total.days + days,
            };
          },
          { value: 0, days: 0 }
        );
        item.progress = weighted.days ? Math.round(weighted.value / weighted.days) : 0;
      }
    }
    if (item.date && !item.start) item.start = item.date;
    if (item.date && !item.end) item.end = item.date;
    item.resolved = true;
    return item;
  };

  return rawItems.map((item) => resolve(byId.get(item.id)));
}

function filteredWbsItems(projectId) {
  const query = selectedWbsSearch.trim().toLowerCase();
  const items = normalizeWbsItems(projectId);
  if (!query) return items;
  return items.filter((item) => `${item.code} ${item.title} ${item.type} ${item.owner}`.toLowerCase().includes(query));
}

function wbsTimelineUnits(viewBy) {
  if (viewBy === "quarters") {
    return [
      { label: "Q1", caption: "JAN - MAR", start: "2024-01-01", end: "2024-03-31", width: WBS_QUARTER_WIDTH },
      { label: "Q2", caption: "APR - JUN", start: "2024-04-01", end: "2024-06-30", width: WBS_QUARTER_WIDTH },
      { label: "Q3", caption: "JUL - SEP", start: "2024-07-01", end: "2024-09-30", width: WBS_QUARTER_WIDTH },
      { label: "Q4", caption: "OCT - DEC", start: "2024-10-01", end: "2024-12-31", width: WBS_QUARTER_WIDTH },
    ];
  }
  return Array.from({ length: 12 }, (_, index) => {
    const start = new Date(2024, index, 1);
    const end = new Date(2024, index + 1, 0);
    return {
      label: start.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      caption: "",
      start: dateKey(start),
      end: dateKey(end),
      width: WBS_MONTH_WIDTH,
    };
  });
}

function wbsTimelineWidth(units) {
  return units.reduce((total, unit) => total + unit.width, 0) * selectedWbsZoom;
}

function wbsPositionForDate(date, totalWidth) {
  const start = parseDate(WBS_TIMELINE_START);
  const end = parseDate(WBS_TIMELINE_END);
  const clamped = clampDate(toDateOnly(date), start, end);
  const totalDays = Math.max(1, daysBetween(start, end) + 1);
  return Math.round((daysBetween(start, clamped) / totalDays) * totalWidth);
}

function wbsBarMetrics(item, totalWidth) {
  const start = wbsItemStart(item);
  const end = wbsItemEnd(item);
  const left = wbsPositionForDate(start, totalWidth);
  const right = wbsPositionForDate(end, totalWidth);
  return {
    left,
    width: Math.max(28, right - left),
  };
}

function wbsTypeKey(type) {
  return String(type).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function wbsTypeIcon(type) {
  const normalized = String(type).toLowerCase();
  if (normalized.includes("project")) return "building";
  if (normalized.includes("milestone")) return "diamond";
  if (normalized.includes("stage")) return "stageGate";
  if (normalized.includes("end")) return "endProduct";
  return "management";
}

function wbsProgressLabel(item) {
  if (item.type === "Milestone" || item.type === "Stage Gate") {
    return item.progress >= 100 ? "Done" : "Planned";
  }
  return `${Math.round(item.progress || 0)}%`;
}

function defaultPlaygroundItems(typeId, projectId) {
  const project = playgroundProjectId(projectId);
  const samples = {
    benefits: ["Service adoption baseline", "Citizen satisfaction uplift", "Operating cost reduction", "Benefit owner sign-off"],
    risks: ["Funding approval delay", "Vendor dependency lead time", "Data migration readiness", "Sponsor availability"],
    milestones: ["Execution gate on Jun 12", "Pilot review window", "Benefits checkpoint", "Closure readiness review"],
  };
  return (samples[typeId] || [`New ${playgroundType(typeId).singular} for ${project}`]).slice();
}

function createPlaygroundState(projectId) {
  const project = playgroundProjectId(projectId);
  return {
    project: {
      id: "project",
      x: 1086,
      y: 560,
    },
    nodes: [
      { id: "benefits", type: "benefits", x: 1188, y: 770, items: defaultPlaygroundItems("benefits", project) },
      { id: "milestones", type: "milestones", x: 876, y: 980, items: defaultPlaygroundItems("milestones", project) },
      { id: "risks", type: "risks", x: 1500, y: 980, items: defaultPlaygroundItems("risks", project) },
    ],
  };
}

function playgroundStateFor(projectId) {
  const project = playgroundProjectId(projectId);
  if (!playgroundCanvasStates[project]) {
    playgroundCanvasStates[project] = createPlaygroundState(project);
  }
  return playgroundCanvasStates[project];
}

function playgroundNodeFor(state, nodeId) {
  if (nodeId === "project") return state.project;
  return state.nodes.find((node) => node.id === nodeId);
}

function playgroundDrawerContext(drawer = selectedPlaygroundDrawer) {
  if (!drawer) return null;
  const state = playgroundStateFor(playgroundProjectId(selectedProject));
  const node = playgroundNodeFor(state, drawer.nodeId);
  if (!node || node.id === "project") return null;
  const type = playgroundType(node.type);
  const item = Number.isInteger(drawer.itemIndex) ? node.items[drawer.itemIndex] : null;
  return { drawer, state, node, type, item };
}

function playgroundItemStatus(index) {
  const statuses = ["Draft", "Ready", "Needs owner", "Under review", "Approved"];
  return statuses[index % statuses.length];
}

function playgroundItemTitle(item) {
  return typeof item === "string" ? item : item?.title || "Untitled item";
}

function playgroundItemNote(item) {
  return typeof item === "string" ? "" : item?.note || "";
}

function playgroundZoomLabel() {
  return `${Math.round(playgroundZoom * 100)}%`;
}

function playgroundViewStyle() {
  return `--playground-zoom:${playgroundZoom}; --playground-pan-x:${Math.round(playgroundPan.x)}px; --playground-pan-y:${Math.round(playgroundPan.y)}px`;
}

function workKindLabel(kind) {
  const labels = {
    dependency: "Dependency",
    benefit: "Benefit",
    risk: "Risk",
    report: "Report",
    task: "Task",
    milestone: "Milestone",
    "end-product": "End product",
    "management-product": "Management product",
    issue: "Issue",
  };
  return labels[kind] || "Work item";
}

function reportRowsForSelection(projectId) {
  return reportStatusHistory
    .filter((report) => matchesProject(projectId, report.project))
    .map((report) => {
      if (!reportDrafts[report.project]) return report;
      return {
        ...report,
        dueLabel: "Draft created",
        dueTone: "amber",
        trend: report.trend.map((point, index) => (index === report.trend.length - 1 ? { ...point, status: "draft" } : point)),
      };
    });
}

function reportVisualStatus(status) {
  if (status === "missed" || status === "overdue") {
    return { className: "off-track", label: "Off Track", icon: "issues" };
  }

  if (status === "due" || status === "attention" || status === "draft") {
    return { className: "alert", label: "Alert", icon: "alert" };
  }

  return { className: "on-track", label: "On Track", icon: "check" };
}

function reportStatusTone(status) {
  return reportVisualStatus(status).className;
}

function reportStatusLabel(status) {
  const labels = {
    submitted: "Submitted",
    draft: "Draft ready",
    due: "Due",
    attention: "Alert",
    missed: "Missed",
    overdue: "Overdue",
  };
  return labels[status] || "Planned";
}

function reportStatusDate(point, index) {
  const dates = ["Jan 18, 2026", "Feb 18, 2026", "Mar 18, 2026", "Apr 18, 2026", "May 10, 2026"];
  return point.date || dates[index] || `${point.label} 18, 2026`;
}

function reportStatusDetail(point, index) {
  const date = reportStatusDate(point, index);
  if (point.status === "submitted") return `Approved on ${date}`;
  if (point.status === "missed") return `Missed submission on ${date}`;
  if (point.status === "overdue") return `Overdue since ${date}`;
  if (point.status === "draft") return `Draft created for ${date}`;
  return `Action needed by ${date}`;
}

function aggregateReportTrend(rows) {
  if (!rows.length) return [];
  return rows[0].trend.map((point, index) => {
    const statuses = rows.map((report) => report.trend[index]?.status).filter(Boolean);
    const status = statuses.some((item) => item === "overdue" || item === "missed")
      ? "overdue"
      : statuses.some((item) => item === "due" || item === "attention")
        ? "due"
        : statuses.some((item) => item === "draft")
          ? "draft"
          : "submitted";
    return { label: point.label, status };
  });
}

function nextReportTarget(rows) {
  return rows.find((report) => report.dueTone === "red") || rows.find((report) => report.dueTone === "amber") || rows[0];
}

function calendarItemStatus(item) {
  const today = dateKey(toDateOnly(new Date()));
  if (item.date === today) return "Due today";
  return item.date < today ? "Past item" : "Upcoming";
}

function getLifetimeRange(today) {
  const dates = timelineRows.flatMap((row) => [parseDate(row.start), parseDate(row.end), today]);
  const minYear = Math.min(...dates.map((date) => date.getFullYear()));
  const maxYear = Math.max(...dates.map((date) => date.getFullYear()));
  return {
    start: new Date(minYear, 0, 1),
    end: new Date(maxYear, 11, 31),
    labels: Array.from({ length: maxYear - minYear + 1 }, (_, index) => `${minYear + index}`),
    title: "Lifetime plan",
  };
}

function timelineRange(rangeId) {
  const today = toDateOnly(new Date());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const quarterStart = startOfQuarter(today);
  const yearStart = new Date(today.getFullYear(), 0, 1);

  if (rangeId === "week") {
    const start = startOfWeek(today);
    return {
      start,
      end: addDays(start, 6),
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      title: "This week",
    };
  }

  if (rangeId === "month") {
    return {
      start: monthStart,
      end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      title: formatMonthYear(today),
    };
  }

  if (rangeId === "quarter") {
    return {
      start: quarterStart,
      end: endOfQuarter(today),
      labels: Array.from({ length: 3 }, (_, index) =>
        new Date(today.getFullYear(), quarterStart.getMonth() + index, 1).toLocaleDateString("en-US", { month: "short" })
      ),
      title: `Q${Math.floor(today.getMonth() / 3) + 1} ${today.getFullYear()}`,
    };
  }

  if (rangeId === "lifetime") {
    return getLifetimeRange(today);
  }

  return {
    start: yearStart,
    end: new Date(today.getFullYear(), 11, 31),
    labels: ["Q1", "Q2", "Q3", "Q4"],
    title: `${today.getFullYear()} delivery year`,
  };
}

function overlapsRange(row, range) {
  const rowStart = parseDate(row.start);
  const rowEnd = parseDate(row.end);
  return rowStart <= range.end && rowEnd >= range.start;
}

function timelineGridBackground(labelCount) {
  return Array.from({ length: Math.max(labelCount - 1, 0) }, (_, index) => {
    const position = ((index + 1) / labelCount) * 100;
    return `linear-gradient(90deg, transparent calc(${position}% - 0.5px), var(--line) calc(${position}% - 0.5px), var(--line) calc(${position}% + 0.5px), transparent calc(${position}% + 0.5px))`;
  }).join(", ");
}

function timelineBarMetrics(row, range) {
  const rangeDays = daysBetween(range.start, range.end) + 1;
  const start = clampDate(parseDate(row.start), range.start, range.end);
  const end = clampDate(parseDate(row.end), range.start, range.end);
  return {
    left: Math.max(0, (daysBetween(range.start, start) / rangeDays) * 100),
    width: Math.max(1.5, ((daysBetween(start, end) + 1) / rangeDays) * 100),
  };
}

function todayPosition(range) {
  const today = toDateOnly(new Date());
  if (today < range.start || today > range.end) return null;
  return (daysBetween(range.start, today) / (daysBetween(range.start, range.end) + 1)) * 100;
}

function assignedProjects() {
  return projects.filter((project) => !isAllProjects(project.id));
}

function projectDeliverables(projectId) {
  return timelineRows.filter((row) => row.project === projectId).sort((first, second) => parseDate(first.start) - parseDate(second.start));
}

function projectTone(projectId) {
  const tones = {
    "Vision 2030": "green",
    "NEOM Integration": "amber",
    "Smart City Alpha": "blue",
    "PMO Capability": "green",
  };
  return tones[projectId] || "blue";
}

function projectTimelineRow(project) {
  const deliverables = projectDeliverables(project.id);
  const starts = deliverables.map((row) => parseDate(row.start));
  const ends = deliverables.map((row) => parseDate(row.end));
  return {
    title: project.name,
    detail: `${deliverables.length} deliverables`,
    start: new Date(Math.min(...starts)).toISOString().slice(0, 10),
    end: new Date(Math.max(...ends)).toISOString().slice(0, 10),
    tone: projectTone(project.id),
  };
}

function deliverableTimelineRow(row) {
  return {
    title: row.title,
    detail: formatDateRange(parseDate(row.start), parseDate(row.end)),
    start: row.start,
    end: row.end,
    tone: row.tone,
  };
}

function timelineDisplayRows(selectedProject) {
  if (isAllProjects(selectedProject)) {
    return assignedProjects().map(projectTimelineRow);
  }

  return projectDeliverables(selectedProject).map(deliverableTimelineRow);
}

function stageProfile(projectId) {
  return projectStageProfiles.find((profile) => profile.project === projectId);
}

function stageProfilesForSelection(selectedProject) {
  if (isAllProjects(selectedProject)) return assignedProjects().map((project) => stageProfile(project.id)).filter(Boolean);
  return [stageProfile(selectedProject)].filter(Boolean);
}

function stageCurrentIndex(profile) {
  return stageAdvancements[profile.project] ?? profile.currentStage;
}

function stageStatus(profile, index) {
  const currentIndex = stageCurrentIndex(profile);
  if (index < currentIndex) return "complete";
  if (index === currentIndex) return "current";
  return "upcoming";
}

function stageStatusLabel(status) {
  if (status === "complete") return "Complete";
  if (status === "current") return "Current stage";
  return "Upcoming";
}

function stageGateButtonLabel(status) {
  if (status === "complete") return "Complete";
  if (status === "current") return "Submit gate";
  return "Prepare gate";
}

function stageGateKey(project, stageId) {
  return `${project}|${stageId}`;
}

function stageGateContext(key) {
  if (!key) return null;
  const [project, stageId] = key.split("|");
  const profile = stageProfile(project);
  const stageIndex = stageDefinitions.findIndex((stage) => stage.id === stageId);
  if (!profile || stageIndex < 0) return null;
  const stage = stageDefinitions[stageIndex];
  const status = stageStatus(profile, stageIndex);
  return { profile, stage, stageIndex, status };
}

function gateReadinessText(profile, status) {
  if (status === "complete") return `${profile.gateTotal}/${profile.gateTotal} submitted`;
  if (status === "current") return `${profile.gateDone}/${profile.gateTotal} ready`;
  return "Not started";
}

function StageGateDrawer(selectedGate) {
  const context = stageGateContext(selectedGate);
  if (!context) return "";
  const { profile, stage, status } = context;
  const canSubmit = status === "current";
  const checkedCount = status === "complete" ? profile.gateTotal : profile.gateDone;

  return `
    <div class="stage-drawer-shell" aria-live="polite">
      <button class="stage-drawer-backdrop" type="button" data-stage-gate-close aria-label="Close stage gate drawer"></button>
      <aside class="stage-gate-drawer" aria-label="${escapeHtml(`${profile.project} ${stage.gate} submission`)}">
        <div class="drawer-head">
          <button class="drawer-close" type="button" data-stage-gate-close aria-label="Close drawer">${icon("prev")}</button>
          <div>
            <span class="eyebrow">${escapeHtml(profile.project)}</span>
            <h2>${escapeHtml(stage.gate)}</h2>
            <p>${escapeHtml(stage.label)} stage gate submission</p>
          </div>
        </div>
        <div class="drawer-status-card ${status}">
          <strong>${stageStatusLabel(status)}</strong>
          <span>${gateReadinessText(profile, status)} • Due ${escapeHtml(profile.gateDue)}</span>
        </div>
        <form class="stage-gate-form" data-stage-gate-form>
          <div class="drawer-section">
            <span class="drawer-section-title">Checklist</span>
            ${profile.checklist
              .map(
                (item, index) => `
                  <label>
                    <input type="checkbox" ${index < checkedCount ? "checked" : ""} ${status === "complete" ? "disabled" : ""} />
                    <span>${escapeHtml(item)}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          <div class="drawer-section compact">
            <span class="drawer-section-title">Evidence</span>
            <p>${escapeHtml(profile.checkpoint)}</p>
          </div>
          <button class="drawer-submit" type="${canSubmit ? "submit" : "button"}" ${canSubmit ? "" : "disabled"}>
            ${canSubmit ? "Submit and advance stage" : status === "complete" ? "Gate already submitted" : "Current stage required first"}
          </button>
        </form>
      </aside>
    </div>
  `;
}

function ReportComposerDrawer(selectedReportProject) {
  if (!selectedReportProject) return "";
  const report = reportStatusHistory.find((item) => item.project === selectedReportProject) || nextReportTarget(reportStatusHistory);
  const latestStatus = report.trend.at(-1);
  const details = reportCreationDetails[report.project] || reportCreationDetails["Vision 2030"];
  const currentStatus = reportVisualStatus(latestStatus?.status || "due").label;
  const statusOptions = [
    { label: "On track", value: "On track", tone: "green", icon: "check" },
    { label: "Alert/Discuss", value: "Alert", tone: "amber", icon: "bell" },
    { label: "Off track", value: "Off Track", tone: "red", icon: "close" },
  ];
  const narrativeFields = [
    ["Comments", "", details.comments, 4],
    ["Key Achievements and Notable Events", "Achievements / delays / challenges / risk", details.achievements, 4],
    ["Planned Activities for the next reporting period", "", details.planned, 4],
  ];
  const pastOverviewTrend = [
    "31/03/2026",
    "31/12/2025",
    "30/09/2025",
    "30/06/2025",
    "31/12/2024",
  ];
  const reportProgress = Number.isInteger(details.progress) ? `${details.progress}%` : `${details.progress}%`;
  const reportEditorField = ([label, hint, value, rows]) => `
    <label class="report-editor-field">
      <span class="report-editor-label">
        ${escapeHtml(label)}
        ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
      </span>
      <textarea class="report-description-input" rows="${rows}" maxlength="3000">${escapeHtml(value)}</textarea>
    </label>
  `;
  const reviewAreas = [
    ["Scope", "On track", "Baseline unchanged", "green"],
    ["Schedule", "Alert", "Gate evidence due this week", "amber"],
    ["Budget", "On track", "No variance reported", "green"],
    ["Benefits", "Alert", "Owner response pending", "amber"],
    ["Risks", "Off track", "RAID refresh required", "red"],
    ["Issues", "On track", "No blocker escalated", "green"],
    ["Resource", "On track", "Core team assigned", "green"],
    ["Dependency", "Alert", "External owner to confirm", "amber"],
  ];
  const scopePastStatuses = [
    ["31/03/2026", "red", "Off track"],
    ["31/12/2025", "amber", "Alert/Discuss"],
    ["30/09/2025", "red", "Off track"],
    ["30/06/2025", "amber", "Alert/Discuss"],
    ["31/12/2024", "red", "Off track"],
  ];
  const scopeProducts = [
    {
      title: "Collaboration platform",
      type: "Technology",
      owner: "Richelle Hilton",
      capability: "-",
      dates: "11/02/2026 - 26/06/2026",
      budget: "$0",
      status: "Not Started",
      actualStart: "11/02/2026",
      actualEnd: "26/06/2026",
      completed: "33",
    },
    {
      title: "National R&D database",
      type: "Information",
      owner: "Canning Santos",
      capability: "-",
      dates: "01/01/2026 - 31/05/2026",
      budget: "$0",
      status: "Not Started",
      actualStart: "01/01/2026",
      actualEnd: "31/05/2026",
      completed: "0",
    },
    {
      title: "Opportunity marketplace",
      type: "Technology",
      owner: "Amanda Blevins",
      capability: "-",
      dates: "07/04/2026 - 01/10/2026",
      budget: "$0",
      status: "Not Started",
      actualStart: "07/04/2026",
      actualEnd: "01/10/2026",
      completed: "",
    },
    {
      title: "CRM",
      type: "-",
      owner: "-",
      capability: "-",
      dates: "-",
      budget: "$0",
      status: "Not Started",
      actualStart: "-",
      actualEnd: "-",
      completed: "",
    },
  ];
  const reportSectionId = (label) => `report-section-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const reportSections = ["Overview", ...reviewAreas.map(([label]) => label)];
  const reportSectionFill = (section) => {
    if (section === "Overview") return "complete";
    const area = reviewAreas.find(([label]) => label === section);
    return area?.[3] === "green" ? "complete" : "partial";
  };
  const reportSectionFillLabel = (state) => (state === "complete" ? "Complete" : "Partially filled");
  const scopeProductCard = (product, index) => `
    <article class="scope-product-card">
      <label class="scope-product-title">
        <input type="checkbox" ${index === 0 ? "checked" : ""} />
        <span>${escapeHtml(product.title)}</span>
      </label>
      <div class="scope-product-grid">
        <span><small>Type</small><strong>${escapeHtml(product.type)}</strong></span>
        <span><small>Product owner</small><strong>${escapeHtml(product.owner)}</strong></span>
        <span><small>Capability</small><strong>${escapeHtml(product.capability)}</strong></span>
        <span><small>Start - end date</small><strong>${escapeHtml(product.dates)}</strong></span>
        <span><small>Budget</small><strong>${escapeHtml(product.budget)}</strong></span>
      </div>
      <div class="scope-product-controls">
        <label>
          <span>Report status</span>
          <select>
            <option>${escapeHtml(product.status)}</option>
            <option>In Progress</option>
            <option>Complete</option>
          </select>
        </label>
        <label>
          <span>Actual start</span>
          <input type="text" value="${escapeHtml(product.actualStart)}" />
        </label>
        <label>
          <span>Actual end</span>
          <input type="text" value="${escapeHtml(product.actualEnd)}" />
        </label>
        <label>
          <span>Completed</span>
          <span class="scope-percent-input"><input type="text" value="${escapeHtml(product.completed)}" />%</span>
        </label>
      </div>
    </article>
  `;
  const scopeReportSection = (status, tone) => `
    <section class="report-form-section report-area-section report-scope-section" id="${escapeHtml(reportSectionId("Scope"))}" data-report-section role="tabpanel" hidden>
      <div class="report-section-head">
        <div>
          <h3>Scope</h3>
          <p>Review scope status, trend, and reportable products for this interval.</p>
        </div>
        <span class="report-area-pill ${tone}">${escapeHtml(status)}</span>
      </div>

      <div class="scope-status-grid">
        <div class="scope-panel">
          <span class="scope-panel-label">Reporting status</span>
          <div class="report-inline-status" role="radiogroup" aria-label="Scope reporting status">
            ${statusOptions
              .map(
                (option, index) => `
                  <label class="${option.tone}">
                    <input type="radio" name="scope-reporting-status" ${index === 0 ? "checked" : ""} />
                    <span>${icon(option.icon)}${escapeHtml(option.label)}</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="scope-panel">
          <span class="scope-panel-label">Scope trend</span>
          <div class="scope-trend-options" role="radiogroup" aria-label="Scope trend">
            <label><input type="radio" name="scope-trend" checked /><span>Improving</span></label>
            <label><input type="radio" name="scope-trend" /><span>No change</span></label>
            <label><input type="radio" name="scope-trend" /><span>Declining</span></label>
          </div>
        </div>

        <label class="scope-panel scope-comment-panel">
          <span class="scope-panel-label">Comment</span>
          <textarea class="report-description-input" rows="3" placeholder="Add scope commentary for this interval"></textarea>
        </label>

        <div class="scope-panel scope-past-panel">
          <span class="scope-panel-label">Past reported statuses</span>
          <div class="scope-status-timeline">
            ${scopePastStatuses
              .map(
                ([date, statusTone, label]) => `
                  <span class="${statusTone}" title="${escapeHtml(label)}">
                    <i>${icon(statusTone === "amber" ? "bell" : "close")}</i>
                    <small>${escapeHtml(date)}</small>
                  </span>
                `
              )
              .join("")}
          </div>
        </div>
      </div>

      <div class="scope-group-card">
        <div class="scope-group-head">
          <div>
            <strong>End Product</strong>
            <span>${scopeProducts.length} items</span>
          </div>
          <label class="report-include-toggle">
            <input type="checkbox" />
            <span>Add to report</span>
          </label>
        </div>
        <div class="scope-product-list">
          ${scopeProducts.map(scopeProductCard).join("")}
        </div>
      </div>

      <div class="scope-group-card compact">
        <div class="scope-group-head">
          <div>
            <strong>Management Product</strong>
            <span>0 items</span>
          </div>
          <label class="report-include-toggle">
            <input type="checkbox" checked />
            <span>Add to report</span>
          </label>
        </div>
        <p class="scope-empty-note">No management products are linked to this reporting interval.</p>
      </div>
    </section>
  `;

  return `
    <div class="report-drawer-shell" aria-live="polite">
      <button class="report-drawer-backdrop" type="button" data-report-close aria-label="Close report drawer"></button>
      <aside class="report-drawer" aria-label="${escapeHtml(`${report.project} report draft`)}">
        <form class="report-compose-form" data-report-form>
          <div class="report-drawer-top">
            <div class="report-common-row">
              <button class="drawer-close" type="button" data-report-close aria-label="Close drawer">${icon("prev")}</button>
              <div class="report-drawer-title">
                <h2>${escapeHtml(report.project)}</h2>
                <p>Project Report</p>
              </div>
              <div class="report-common-meta">
                <span>Stage: <strong>${escapeHtml(details.stage)}</strong></span>
                <span>State: <strong>${escapeHtml(details.state)}</strong></span>
              </div>
              <span class="report-due-pill ${report.dueTone}">${escapeHtml(report.dueLabel)}</span>
              <div class="report-top-actions">
                <button class="report-top-cancel" type="button" data-report-close>Cancel</button>
                <button class="report-top-save" type="submit">Save</button>
              </div>
            </div>

            <div class="report-interval-row">
              <span>Interval start date: <strong>${escapeHtml(details.intervalStart)}</strong></span>
              <span>Interval end date: <strong>${escapeHtml(details.intervalEnd)}</strong></span>
              <span>Interval Status: <strong>${escapeHtml(details.intervalStatus.toUpperCase())}</strong></span>
            </div>
          </div>

          <div class="report-drawer-body">
            <nav class="report-section-nav" aria-label="Report sections" role="tablist">
              ${reportSections
                .map(
                  (section, index) => {
                    const fillState = reportSectionFill(section);
                    const sectionId = reportSectionId(section);
                    return `
                    <button
                      class="${index === 0 ? "active" : ""}"
                      type="button"
                      aria-label="${escapeHtml(`${section}, ${reportSectionFillLabel(fillState)}`)}"
                      aria-selected="${index === 0 ? "true" : "false"}"
                      aria-controls="${escapeHtml(sectionId)}"
                      data-report-section-target="${escapeHtml(sectionId)}"
                      role="tab"
                      title="${escapeHtml(reportSectionFillLabel(fillState))}"
                    >
                      <span class="report-section-name">${escapeHtml(section)}</span>
                      <span class="report-section-fill ${fillState}" aria-hidden="true">
                        ${fillState === "complete" ? icon("check") : ""}
                      </span>
                    </button>
                  `;
                  }
                )
                .join("")}
            </nav>

            <div class="report-section-stack">
              <div class="report-overview-group" id="${escapeHtml(reportSectionId("Overview"))}" data-report-section role="tabpanel">
                <section class="report-form-section report-overview-section">
                  <div class="report-overview-top">
                    <div class="report-overview-status">
                      <span class="report-overview-label">Overall Status:</span>
                      <div class="report-inline-status" role="radiogroup" aria-label="Overall status">
                        ${statusOptions
                          .map(
                            (option, index) => `
                              <label class="${option.tone}">
                                <input type="radio" name="overall-status" ${option.value === currentStatus || (!index && currentStatus === "On Track") ? "checked" : ""} />
                                <span>${icon(option.icon)}${escapeHtml(option.label)}</span>
                              </label>
                            `
                          )
                          .join("")}
                      </div>
                    </div>
                    <div class="report-overview-trend">
                      <span class="report-overview-label">Overall Status Trend:</span>
                      <strong>${icon("arrow")} ${escapeHtml(details.overallTrend)}</strong>
                    </div>
                    <div class="report-overview-past">
                      <span class="report-overview-label">Past Overview Trend:</span>
                      <div class="report-past-trend">
                        ${pastOverviewTrend
                          .map(
                            (date) => `
                              <span>
                                ${icon("check")}
                                <small>${escapeHtml(date)}</small>
                              </span>
                            `
                          )
                          .join("")}
                      </div>
                    </div>
                  </div>

                  <div class="report-progress-row">
                    <div class="report-progress-field">
                      <span class="report-overview-label">Project Progress:</span>
                      <div class="report-progress-line">
                        <strong>${escapeHtml(reportProgress)}</strong>
                        <i><em style="width:${details.progress}%"></em></i>
                      </div>
                    </div>
                    <div class="report-end-dates">
                      <span>Baseline End date <strong>${escapeHtml(details.baselineEnd)}</strong></span>
                      <span>Forecast End date <strong>${escapeHtml(details.forecastEnd)}</strong></span>
                    </div>
                  </div>

                  <div class="report-narrative-grid">
                    ${narrativeFields
                      .map(reportEditorField)
                      .join("")}
                  </div>
                </section>
              </div>

              ${reviewAreas
                .map(
                  ([label, status, note, tone]) =>
                    label === "Scope"
                      ? scopeReportSection(status, tone)
                      : `
                    <section class="report-form-section report-area-section" id="${escapeHtml(reportSectionId(label))}" data-report-section role="tabpanel" hidden>
                      <div class="report-section-head">
                        <div>
                          <h3>${escapeHtml(label)}</h3>
                        </div>
                        <span class="report-area-pill ${tone}">${escapeHtml(status)}</span>
                      </div>
                      <label class="report-form-field">
                        <span>Update</span>
                        <textarea rows="2">${escapeHtml(note)}</textarea>
                      </label>
                    </section>
                  `
                )
                .join("")}
            </div>
          </div>

        </form>
      </aside>
    </div>
  `;
}

function icon(name) {
  const icons = {
    logo: "panels-top-left",
    home: "house",
    sun: "sun",
    bell: "bell",
    mirror: "panel-left",
    grid: "layout-grid",
    chart: "chart-column",
    chat: "message-square-text",
    building: "building-2",
    dollar: "circle-dollar-sign",
    user: "user-round",
    settings: "settings",
    help: "circle-help",
    logout: "log-out",
    columns: "columns-3",
    calendar: "calendar-days",
    timeline: "list-tree",
    arrow: "chevron-right",
    compass: "compass",
    prev: "chevron-left",
    search: "search",
    refresh: "refresh-cw",
    fullscreen: "maximize-2",
    minimize: "minimize-2",
    plan: "file-text",
    checklist: "check-square",
    package: "package",
    portfolio: "bar-chart-3",
    wbs: "git-branch",
    stageGate: "clipboard-check",
    changeRequest: "git-pull-request",
    dependencies: "network",
    resources: "users",
    risks: "triangle-alert",
    issues: "circle-x",
    closure: "file-x",
    lessons: "lightbulb",
    benefit: "circle-check",
    management: "file-text",
    endProduct: "package",
    milestone: "flag",
    playground: "git-branch",
    project: "folder",
    eye: "eye",
    eyeOff: "eye-off",
    plus: "plus",
    minus: "minus",
    move: "move",
    close: "x",
    history: "history",
    check: "circle-check",
    alert: "triangle-alert",
    trendUp: "trending-up",
    trendDown: "trending-down",
    filter: "filter",
    book: "book-open",
    more: "ellipsis",
    status: "circle",
    todo: "circle-dot",
    down: "chevron-down",
    split: "columns-2",
    undo: "undo-2",
    redo: "redo-2",
    indent: "indent-increase",
    outdent: "indent-decrease",
    trash: "trash-2",
    grip: "grip-vertical",
    sparkles: "sparkles",
    diamond: "diamond",
    moreVertical: "ellipsis-vertical",
    edit: "pencil",
    info: "info",
    list: "list",
  };
  return `<span class="icon" aria-hidden="true"><i data-lucide="${icons[name] || icons.grid}"></i></span>`;
}

function initLucideIcons() {
  if (!window.lucide) return;
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 1.6,
      "aria-hidden": "true",
    },
  });
}

function ProjectOptions(selectedProject, includeAll = true) {
  return projects
    .filter((project) => includeAll || !isAllProjects(project.id))
    .map(
      (project) => `
        <option value="${project.id}" ${project.id === selectedProject ? "selected" : ""}>${project.name}</option>
      `
    )
    .join("");
}

function ProjectSelector(selectedProject, includeAll = true) {
  return `
    <label class="project-switch" data-tour-target="project-switch">
      <span class="project-switch-label">Viewing</span>
      <span class="project-select-wrap">
        <select id="project-select" data-project-select aria-label="Select project">
          ${ProjectOptions(selectedProject, includeAll)}
        </select>
        ${icon("down")}
      </span>
    </label>
  `;
}

function NoProjectSelector() {
  const label = pmoAssignmentReady ? "Project assigned" : "No assigned projects";
  return `
    <div class="project-switch no-project-switch ${pmoAssignmentReady ? "is-ready" : ""}" aria-label="${escapeHtml(label)}">
      <span class="project-switch-label">Status</span>
      <span class="no-project-switch-value">
        ${icon(pmoAssignmentReady ? "check" : "bell")}
        ${escapeHtml(label)}
      </span>
    </div>
  `;
}

function AppHeader(selectedProject, notificationOpen = false, selectedPage = "workspace", frontDoorMode = "assigned") {
  const isPlayground = selectedPage === "playground";
  const isUnassigned = frontDoorMode === "unassigned";
  const isProjectScopedPage = isPlayground || selectedPage === "wbs" || selectedPage === "project-plan";
  const headerProject = isPlayground ? playgroundProjectId(selectedProject) : selectedProject;

  return `
    <header class="app-header ${isUnassigned ? "unassigned-header" : ""}">
      <div class="brand-block">
        <button class="brand-logo-button ${isPlayground ? "active" : ""}" type="button" ${isUnassigned ? "disabled aria-disabled=\"true\"" : "data-page-target=\"playground\""} aria-label="Open Project Playground">
          <img class="brand-logo" src="./assets/tasama-small.svg" alt="Tasama" />
        </button>
        ${isUnassigned ? NoProjectSelector() : ProjectSelector(headerProject, !isProjectScopedPage)}
      </div>
      <div class="header-actions">
        <button class="round-button" type="button" aria-label="Theme">${icon("sun")}</button>
        <button class="round-button notification-button ${notificationOpen ? "active" : ""}" type="button" aria-label="Notifications" aria-expanded="${notificationOpen}" data-notification-toggle>
          ${icon("bell")}
          <span class="notification-badge" aria-hidden="true"></span>
        </button>
        <button class="profile-chip" type="button">
          <span class="avatar-xl">MH<i></i></span>
          <span><strong>Muna Hassan</strong><small>Senior Analyst</small></span>
        </button>
      </div>
    </header>
  `;
}

function NotificationPanel(isOpen) {
  if (!isOpen) return "";
  const unreadCount = notifications.filter((item) => item.unread).length;
  return `
    <div class="notification-overlay" role="presentation">
      <button class="notification-backdrop" type="button" data-notification-close aria-label="Close notifications"></button>
      <section class="notification-panel" role="dialog" aria-modal="true" aria-label="Notifications">
        <div class="notification-head">
          <div>
            <h2>Notifications</h2>
            <span>${unreadCount} unread updates</span>
          </div>
          <button class="notification-close" type="button" data-notification-close aria-label="Close notifications">${icon("close")}</button>
        </div>
        <div class="notification-list">
          ${notifications
            .map(
              (item) => `
                <article class="notification-item ${item.tone} ${item.unread ? "unread" : ""}">
                  <span class="notification-item-icon">${icon(item.icon)}</span>
                  <div>
                    <div class="notification-item-top">
                      <strong>${escapeHtml(item.title)}</strong>
                      <time>${escapeHtml(item.time)}</time>
                    </div>
                    <p>${escapeHtml(item.detail)}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <button class="notification-footer-action" type="button">Open notification center</button>
      </section>
    </div>
  `;
}

const guidedTourSteps = [
  {
    target: "project-switch",
    title: "Choose your working scope",
    body: "Start with all assigned projects for a portfolio scan, then switch into a single project when you need detail.",
    daily: "Daily PM move: check what needs attention across every project before going deep.",
  },
  {
    target: "frontdoor-actions",
    title: "Open the right workspace quickly",
    body: "Use Workspaces for project rooms and Learning Hub for playbooks, templates, and governance guidance.",
    daily: "Use these when you need context before acting on a dependency, risk, or stage gate.",
  },
  {
    target: "workspace-tabs",
    title: "Move between work and lifecycle views",
    body: "Actions is your day-to-day board. Stages shows where each project sits in its lifecycle and what gate evidence is needed.",
    daily: "Start in Actions, then use Stages when a gate submission is due.",
  },
  {
    target: "action-board",
    title: "Clear the daily action board",
    body: "Overdue, this week, and upcoming lanes organize what needs your attention. Filters help isolate reports, risks, benefits, and dependencies.",
    daily: "Work left to right: overdue first, this week next, upcoming last.",
  },
  {
    target: "create-psr",
    title: "Create or update a PSR",
    body: "Report actions open the PSR drawer where you update status, scope, trends, commentary, and reportable evidence.",
    daily: "When the weekly report is due, open the PSR, review the sections, save the draft, and submit when ready.",
  },
  {
    target: "right-report-widget",
    title: "Watch reporting trends",
    body: "The reporting widget shows recent PSR signals and gives you a fast create action for each project.",
    daily: "Use it to spot off-track reports before they become escalations.",
  },
  {
    target: "side-navigation",
    title: "Navigate the PM console",
    body: "The left rail keeps core spaces one click away: workspace, rooms, reports, messages, help, and logout.",
    daily: "Use it when you need to leave the front door without losing the project context.",
  },
];

function GuidedTourOverlay() {
  if (!guidedTourActive) return "";
  const step = guidedTourSteps[guidedTourStep] || guidedTourSteps[0];
  const isFirst = guidedTourStep === 0;
  const isLast = guidedTourStep === guidedTourSteps.length - 1;

  return `
    <div class="guided-tour-overlay" data-tour-overlay data-tour-target-name="${escapeHtml(step.target)}" aria-live="polite">
      <div class="guided-tour-shade" aria-hidden="true"></div>
      <div class="guided-tour-spotlight" data-tour-spotlight aria-hidden="true"></div>
      <section class="guided-tour-card" data-tour-card role="dialog" aria-modal="true" aria-label="${escapeHtml(step.title)}">
        <button class="guided-tour-close" type="button" data-tour-end aria-label="End guided tour">${icon("close")}</button>
        <span class="guided-tour-kicker">Guided tour · ${guidedTourStep + 1} of ${guidedTourSteps.length}</span>
        <h2>${escapeHtml(step.title)}</h2>
        <p>${escapeHtml(step.body)}</p>
        <div class="guided-tour-daily">
          <strong>How a PM uses this</strong>
          <span>${escapeHtml(step.daily)}</span>
        </div>
        <div class="guided-tour-progress" aria-hidden="true">
          ${guidedTourSteps.map((_, index) => `<span class="${index === guidedTourStep ? "active" : ""}"></span>`).join("")}
        </div>
        <div class="guided-tour-actions">
          <button class="guided-tour-secondary" type="button" data-tour-prev ${isFirst ? "disabled" : ""}>Back</button>
          <button class="guided-tour-secondary" type="button" data-tour-end>Skip</button>
          <button class="guided-tour-primary" type="button" data-tour-next>${isLast ? "Finish" : "Next"}</button>
        </div>
      </section>
    </div>
  `;
}

function Sidebar(selectedPage = "workspace", frontDoorMode = "assigned") {
  const isUnassigned = frontDoorMode === "unassigned";
  const top = [
    { name: "home", label: "Workspace", page: "workspace" },
    { name: "grid", label: "Rooms" },
    { name: "chart", label: "Reports" },
    { name: "chat", label: "Messages" },
  ];
  return `
    <aside class="side-rail" data-tour-target="side-navigation">
      <nav>
        ${top
          .map((item) => {
            const isActive =
              item.page === selectedPage || (item.page === "workspace" && (selectedPage === "workspaces" || selectedPage === "wbs" || selectedPage === "project-plan"));
            const isDisabled = isUnassigned && item.page !== "workspace";
            return `
              <button class="rail-button ${isActive ? "active" : ""}" type="button" aria-label="${item.label}" ${item.page && !isDisabled ? `data-page-target="${item.page}"` : ""} ${isDisabled ? "disabled aria-disabled=\"true\" title=\"Available after PMO assigns a project\"" : ""}>
                ${icon(item.name)}
              </button>
            `;
          })
          .join("")}
      </nav>
      <nav>
        <button class="rail-button" type="button" aria-label="Help">${icon("help")}</button>
        <button class="rail-button" type="button" aria-label="Logout">${icon("logout")}</button>
      </nav>
    </aside>
  `;
}

function TopDeck() {
  return `
    <section class="top-deck" aria-label="PM front door actions" data-tour-target="frontdoor-actions">
      <button class="action-card workspace-command" type="button" data-page-target="workspaces">
        <span class="action-icon"><img src="./assets/workspace-card-box.svg" alt="" aria-hidden="true" /></span>
        <span class="action-copy">
          <strong>Workspaces</strong>
          <small>Open project rooms</small>
        </span>
        <span class="action-arrow">${icon("arrow")}</span>
      </button>
      <button class="action-card learning-command" type="button">
        <span class="action-icon"><img src="./assets/workspace-card-notebook.svg" alt="" aria-hidden="true" /></span>
        <span class="action-copy">
          <strong>Learning Hub</strong>
          <small>Guides and playbooks</small>
        </span>
        <span class="action-arrow">${icon("arrow")}</span>
      </button>
    </section>
  `;
}

function WorkspaceStatusChip(project) {
  if (project.draft) return `<span class="pm-project-draft-chip">Draft</span>`;
  return `<span class="pm-project-status ${project.statusTone}">${escapeHtml(project.status)}</span>`;
}

function WorkspaceScheduleBars(project) {
  const colors = ["#22c55e", "#fbbf24", "#22c55e", "#fb923c", "#38bdf8"];
  return `
    <div class="pm-project-psr-bars" aria-label="${escapeHtml(project.scheduleNote || "PSR history")}">
      ${colors.map((color) => `<span style="--bar-color:${color}"></span>`).join("")}
      ${project.scheduleNote ? `<small>${escapeHtml(project.scheduleNote)}</small>` : ""}
    </div>
  `;
}

function WorkspaceMetricPanel(project, type) {
  if (type === "schedule") {
    return `
      <div class="pm-project-metric">
        <span>Schedule</span>
        <strong>${project.schedule}% <small>complete</small></strong>
        <div class="pm-project-progress" style="--progress:${project.schedule}%"><i></i></div>
        ${project.scheduleNote ? WorkspaceScheduleBars(project) : ""}
        ${
          project.scheduleDelta
            ? `<p class="${project.scheduleTone || ""}">${project.scheduleTone === "red" ? "- " : "+ "}${escapeHtml(project.scheduleDelta)}</p>`
            : ""
        }
      </div>
    `;
  }

  return `
    <div class="pm-project-metric pm-project-budget">
      <div class="pm-project-budget-ring" style="--budget:${project.budget}%" aria-hidden="true"><i></i></div>
      <span>Budget used</span>
      <strong>${escapeHtml(project.budgetUsed)} <small>/ ${escapeHtml(project.budgetTotal)}</small></strong>
      <p>${escapeHtml(project.budgetNote)}</p>
    </div>
  `;
}

function WorkspaceProjectCard(project) {
  const projectId = project.projectId || project.title;
  const actionAttrs = project.reportProject
    ? `data-report-create="${escapeHtml(project.reportProject)}"`
    : project.draft
      ? `data-page-target="project-plan"`
      : "";

  return `
    <article class="pm-project-card ${project.draft ? "draft" : ""}">
      ${WorkspaceStatusChip(project)}
      <div class="pm-project-card-head">
        <span class="pm-project-code">${icon("project")}${escapeHtml(project.code)}</span>
        <span class="pm-project-stage ${project.draft ? "muted" : ""}">${escapeHtml(project.stage)}</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      ${
        project.draft
          ? `<div class="pm-ai-analysis">
              <span>AI Insight Analysis</span>
              <p>You've been assigned a new project. First step: create your project plan. PMO requires baseline submission within 4 weeks of assignment.</p>
            </div>`
          : `<div class="pm-project-metrics">
              ${WorkspaceMetricPanel(project, "schedule")}
              ${WorkspaceMetricPanel(project, "budget")}
            </div>`
      }
      <div class="pm-project-footer">
        <span class="pm-project-due">${icon("history")}<small>Next PSR due:</small><strong>${escapeHtml(project.nextDue)}</strong></span>
        <div class="pm-project-actions">
          <button class="pm-project-icon-button" type="button" data-page-target="project-plan" data-project-id="${escapeHtml(projectId)}" data-plan-entry="quick" aria-label="${escapeHtml(`Open ${project.title} project plan`)}">${icon("eye")}</button>
          <button class="pm-project-primary" type="button" ${actionAttrs}>${escapeHtml(project.action)}</button>
        </div>
      </div>
    </article>
  `;
}

function WorkspacePortfolioHealth() {
  const items = [
    ["On track", "2", "50%", "green"],
    ["At risk", "1", "25%", "amber"],
    ["Draft", "1", "25%", "neutral"],
  ];

  return `
    <section class="pm-analytics-card pm-portfolio-health">
      <h2>Portfolio health</h2>
      <div class="pm-health-gauge" aria-label="4 total projects">
        <svg class="pm-health-gauge-svg" viewBox="0 0 224 112" aria-hidden="true" focusable="false">
          <path class="pm-health-arc green" d="M 40 96 A 72 72 0 0 1 108 24"></path>
          <path class="pm-health-arc amber" d="M 116 24 A 72 72 0 0 1 162 45"></path>
          <path class="pm-health-arc neutral" d="M 168 50 A 72 72 0 0 1 184 96"></path>
        </svg>
        <span class="pm-health-total"><strong>4</strong><small>Total projects</small></span>
      </div>
      <div class="pm-health-list">
        ${items
          .map(
            ([label, count, share, tone]) => `
              <div class="pm-health-row">
                <span><i class="${tone}"></i>${label} <strong>${count}</strong></span>
                <small>${share}</small>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function WorkspaceReportingTrends() {
  const legend = [
    ["On track", "green"],
    ["Off track", "red"],
    ["Over due", "amber"],
  ];

  return `
    <section class="pm-analytics-card pm-reporting-trends">
      <div>
        <h2>Reporting trends</h2>
        <p>Last 3 PSR statuses</p>
      </div>
      <div class="pm-trend-header"><span></span><span>Mar</span><span>Apr</span><span>May</span></div>
      <div class="pm-trend-grid">
        ${workspaceTrendRows
          .map(
            (row) => `
              <span class="pm-trend-project">${escapeHtml(row.project)}</span>
              ${row.statuses.map((status) => `<i class="${status}"></i>`).join("")}
            `
          )
          .join("")}
      </div>
      <div class="pm-trend-legend">
        ${legend.map(([label, tone]) => `<span><i class="${tone}"></i>${label}</span>`).join("")}
      </div>
    </section>
  `;
}

function WorkspaceBudgetOverview() {
  return `
    <section class="pm-analytics-card pm-budget-overview">
      <h2>Budget overview</h2>
      <div class="pm-budget-panel">
        <h3>UAE Research Map</h3>
        <div class="pm-budget-panel-body">
          <div class="pm-budget-stats">
            <div>
              <span>Total Project Budget</span>
              <strong>$1.59M</strong>
            </div>
            <div>
              <span>Budget Utilized</span>
              <strong>$1.59M</strong>
            </div>
          </div>
          <div class="pm-budget-ring" aria-label="52 percent budget utilized"><span>52%</span></div>
        </div>
      </div>
    </section>
  `;
}

function WorkspacesPage() {
  return `
    <section class="pm-projects-page" aria-label="PM Console projects">
      <div class="pm-projects-board">
        <div class="pm-projects-title-row">
          <div>
            <h1>My Projects</h1>
            <p>Showing all 4 projects</p>
          </div>
          <div class="pm-projects-controls">
            <label class="pm-project-search">
              ${icon("search")}
              <input type="search" aria-label="Search for projects" placeholder="Search for projects" />
            </label>
            <div class="pm-project-view-toggle" aria-label="Project display">
              <button class="active" type="button" aria-label="Grid view">${icon("grid")}</button>
              <button type="button" aria-label="List view">${icon("list")}</button>
            </div>
            <label class="pm-project-select">
              <select aria-label="Project filter">
                <option>All projects</option>
              </select>
              ${icon("down")}
            </label>
            <button class="pm-project-filter" type="button" aria-label="Filter projects">${icon("filter")}</button>
          </div>
        </div>
        <div class="pm-project-card-grid">
          ${workspaceProjectCards.map(WorkspaceProjectCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function ActionCard(item) {
  const opensReport = actionKind(item.type) === "report";
  return `
    <article class="task-card ${item.type.toLowerCase().replace(/\s/g, "-")}" data-card-kind="${actionKind(item.type)}">
      <div class="task-top">
        <span>${item.type}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.project}</p>
      <div class="task-bottom">
        <span class="avatar-sm avatar-${item.owner.toLowerCase()}">${item.owner}</span>
        <small>${item.meta}</small>
        <button
          class="task-action"
          type="button"
          aria-label="${item.cta} ${item.title}"
          ${opensReport ? `data-report-create="${escapeHtml(item.project)}"` : ""}
          ${opensReport ? `data-tour-target="create-psr"` : ""}
        >
          <span>${item.cta}</span>
          ${icon("arrow")}
        </button>
      </div>
    </article>
  `;
}

function WorkFilter(selectedFilter, items, className = "") {
  const selected = boardFilters.find((filter) => filter.id === selectedFilter) || boardFilters[0];
  const countFor = (filter) => (filter.id === "all" ? items.length : items.filter((item) => filterKind(item) === filter.id).length);
  return `
    <div class="board-filter ${className}" aria-label="Quick work filter">
      <span>Show</span>
      <details class="work-filter-dropdown">
        <summary aria-label="${escapeHtml(`Filter by ${selected.label}`)}">
          <span class="work-filter-selected-icon">${icon(selected.icon)}</span>
          <span>${escapeHtml(selected.label)}</span>
          <strong>${countFor(selected)}</strong>
          ${icon("down")}
        </summary>
        <div class="work-filter-menu" role="menu">
          ${boardFilters
            .map(
              (filter) => `
                <button class="${selectedFilter === filter.id ? "active" : ""}" type="button" data-work-filter="${filter.id}" role="menuitem">
                  <span class="work-filter-option-icon">${icon(filter.icon)}</span>
                  <span>${escapeHtml(filter.label)}</span>
                  <strong>${countFor(filter)}</strong>
                </button>
              `
            )
            .join("")}
        </div>
      </details>
    </div>
  `;
}

function AIInsightsWidget() {
  const insightCount = aiWorkspaceInsights.length;
  const insight = aiWorkspaceInsights[((selectedAiInsightIndex % insightCount) + insightCount) % insightCount];

  return `
    <aside class="ai-insight-widget ${insight.tone}" aria-label="AI insights from front door">
      <div class="ai-insight-main">
        <div class="ai-insight-copy">
          <span>${escapeHtml(insight.label)}</span>
          <strong>${escapeHtml(insight.title)}</strong>
          <p>${escapeHtml(insight.body)}</p>
        </div>
        <div class="ai-insight-bubbles ai-insight-bubbles-bottom" aria-label="AI insight slides">
          ${aiWorkspaceInsights
            .map(
              (_, index) => `
                <button
                  class="ai-insight-dot ${index === selectedAiInsightIndex ? "active" : ""}"
                  type="button"
                  data-ai-insight-index="${index}"
                  aria-label="${escapeHtml(`Show AI insight ${index + 1}`)}"
                ></button>
              `
            )
            .join("")}
        </div>
      </div>
    </aside>
  `;
}

function BoardView(selectedProject, selectedView, selectedBoardFilter) {
  const projectItems = actions.flatMap((column) => column.items).filter((item) => matchesProject(selectedProject, item.project));
  return `
    <div class="board-view ${selectedView === "board" ? "" : "is-hidden"}" data-work-view="board" data-tour-target="action-board">
      ${WorkFilter(selectedBoardFilter, projectItems)}
      <div class="kanban-board">
        ${actions
          .map((column) => {
            const projectItems = column.items.filter((item) => matchesProject(selectedProject, item.project));
            const items = projectItems.filter((item) => matchesWorkFilter(selectedBoardFilter, item));
            const emptyText =
              projectItems.length && selectedBoardFilter !== "all"
                ? `No ${boardFilters.find((filter) => filter.id === selectedBoardFilter)?.label.toLowerCase()} in ${column.column.toLowerCase()}`
                : `No actions for ${projectName(selectedProject)}`;
            return `
              <section class="kanban-column ${column.tone}">
                <header>
                  <div>
                    ${BoardColumnIcon(column.tone)}
                    <h3>${column.column}</h3>
                  </div>
                  <strong>${items.length}</strong>
                </header>
                <div class="task-stack">
                  ${items.length ? items.map(ActionCard).join("") : `<div class="empty-column">${emptyText}</div>`}
                </div>
              </section>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function BoardColumnIcon(tone) {
  const icons = {
    red: `
      <span class="board-column-icon overdue" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 4.25 21 19.75H3L12 4.25Z" />
          <path d="M12 9.25v4.5" />
          <path d="M12 17h.01" />
        </svg>
      </span>
    `,
    blue: `
      <span class="board-column-icon this-week" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4.5" width="12" height="16" rx="2.5" />
          <path d="M9.5 3.5h5l.75 2h-6.5l.75-2Z" />
          <path d="M9.5 10h5" />
          <path d="M9.5 14h4" />
        </svg>
      </span>
    `,
    amber: `
      <span class="board-column-icon upcoming" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5.5 13.25v3.25c0 .9.73 1.63 1.63 1.63h9.74c.9 0 1.63-.73 1.63-1.63v-3.25" />
          <path d="M8.25 13.25h1.65c.5 0 .95.3 1.14.76l.09.22c.15.37.5.6.9.6h1.94c.4 0 .75-.23.9-.6l.09-.22c.19-.46.64-.76 1.14-.76h1.65" />
          <path d="M12 4.75v3.1" />
          <path d="M6.7 7.15 8.3 9" />
          <path d="M17.3 7.15 15.7 9" />
        </svg>
      </span>
    `,
  };
  return icons[tone] || icons.blue;
}

function ShellProjectSelector(selectedProject) {
  return `
    <label class="workspace-project-select">
      <select data-project-select aria-label="Select workspace project">
        ${ProjectOptions(selectedProject)}
      </select>
      ${icon("down")}
    </label>
  `;
}

function WorkspaceSearch(selectedView) {
  const placeholders = {
    board: "Search actions",
    calendar: "Search calendar",
    stages: "Search stages",
  };
  return `
    <label class="workspace-search">
      ${icon("search")}
      <input type="search" aria-label="Search ${selectedView}" placeholder="${placeholders[selectedView] || "Search workspace"}" />
    </label>
  `;
}

function WorkspaceTabs(selectedView) {
  const actionsActive = selectedView === "board" || selectedView === "calendar";
  return `
    <div class="workspace-tabs" role="tablist" aria-label="Workspace view" data-tour-target="workspace-tabs">
      <button class="${actionsActive ? "active" : ""}" type="button" data-view-target="calendar" aria-selected="${actionsActive}">
        ${icon("checklist")} Actions
      </button>
      <button class="${selectedView === "stages" ? "active" : ""}" type="button" data-view-target="stages" aria-selected="${selectedView === "stages"}">
        ${icon("timeline")} Stages
      </button>
    </div>
  `;
}

function ActionViewSwitch(selectedView) {
  return `
    <div class="action-view-switch" role="tablist" aria-label="Actions view format">
      <button class="${selectedView === "calendar" ? "active" : ""}" type="button" data-view-target="calendar" aria-selected="${selectedView === "calendar"}">
        ${icon("calendar")} Calendar
      </button>
      <button class="${selectedView === "board" ? "active" : ""}" type="button" data-view-target="board" aria-selected="${selectedView === "board"}">
        ${icon("columns")} Board
      </button>
    </div>
  `;
}

function CalendarCells(selectedProject, selectedBoardFilter, selectedCalendarMonth) {
  const month = monthStart(selectedCalendarMonth);
  const firstDayOffset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  const gridStart = addDays(month, -firstDayOffset);
  const todayKey = dateKey(toDateOnly(new Date()));

  return Array.from({ length: totalCells }, (_, index) => {
    const cellDate = addDays(gridStart, index);
    const cellKey = dateKey(cellDate);
    const isCurrentMonth = sameMonth(cellDate, month);
    const items = isCurrentMonth
      ? timelineItems.filter((item) => item.date === cellKey && matchesProject(selectedProject, item.project) && matchesWorkFilter(selectedBoardFilter, item))
      : [];
    const classes = ["calendar-cell"];
    if (!isCurrentMonth) classes.push("muted");
    if (cellKey === todayKey) classes.push("today");

    return `
      <div class="${classes.join(" ")}">
        <span>${cellDate.getDate()}</span>
        ${items
          .map((item) => {
            const kind = workKindLabel(filterKind(item));
            const status = calendarItemStatus(item);
            return `
              <button
                class="calendar-event ${item.tone}"
                type="button"
                aria-label="${escapeHtml(`${item.label}, ${item.project}, ${formatFullDate(parseDate(item.date))}`)}"
                data-title="${escapeHtml(item.label)}"
                data-project="${escapeHtml(item.project)}"
                data-kind="${escapeHtml(kind)}"
                data-date="${escapeHtml(formatFullDate(parseDate(item.date)))}"
                data-status="${escapeHtml(status)}"
              >
                <span class="calendar-event-dot"></span>
                <span class="calendar-event-title">${escapeHtml(item.label)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }).join("");
}

function CalendarView(selectedProject, selectedView, selectedBoardFilter, selectedCalendarMonth) {
  const month = monthStart(selectedCalendarMonth);
  const calendarProjectScope = "all";
  const projectItems = timelineItems.filter((item) => matchesProject(calendarProjectScope, item.project));
  const monthProjectItems = projectItems.filter((item) => {
    const itemDate = parseDate(item.date);
    return sameMonth(itemDate, month);
  });
  const visibleItems = monthProjectItems.filter((item) => matchesWorkFilter(selectedBoardFilter, item));
  return `
    <div class="calendar-view ${selectedView === "calendar" ? "" : "is-hidden"}" data-work-view="calendar">
      <div class="calendar-command-row">
        <div class="calendar-month-picker" aria-label="Calendar month navigation">
          <button class="calendar-nav-button" type="button" data-calendar-nav="-1" aria-label="Previous month">${icon("prev")}</button>
          <div class="calendar-month-copy">
            <strong>${formatMonthYear(month)}</strong>
            <span>${visibleItems.length} item${visibleItems.length === 1 ? "" : "s"} this month</span>
          </div>
          <button class="calendar-nav-button" type="button" data-calendar-nav="1" aria-label="Next month">${icon("arrow")}</button>
        </div>
        ${WorkFilter(selectedBoardFilter, monthProjectItems, "calendar-filter-bar")}
      </div>
      <div class="timeline-calendar">
        <div class="weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        <div class="calendar-grid">${CalendarCells(calendarProjectScope, selectedBoardFilter, month)}</div>
      </div>
    </div>
  `;
}

function StageCell(profile, stage, index, isFocused) {
  const status = stageStatus(profile, index);
  const readiness = gateReadinessText(profile, status);
  return `
    <div class="stage-cell ${status} ${profile.tone}">
      <div class="stage-cell-top">
        <span class="stage-number">${index + 1}</span>
        <span class="stage-state">${stageStatusLabel(status)}</span>
      </div>
      <div class="stage-cell-copy">
        <strong>${escapeHtml(stage.label)}</strong>
        <small>${escapeHtml(readiness)}</small>
      </div>
      ${isFocused ? `<p>${escapeHtml(stage.gate)} • ${escapeHtml(profile.checkpoint)}</p>` : ""}
      <button
        class="stage-gate-action"
        type="button"
        data-stage-gate="${escapeHtml(stageGateKey(profile.project, stage.id))}"
        aria-label="${escapeHtml(`${stageGateButtonLabel(status)} for ${profile.project} ${stage.label}`)}"
      >
        ${icon(status === "complete" ? "check" : "checklist")}
        <span>${stageGateButtonLabel(status)}</span>
      </button>
    </div>
  `;
}

function StageRow(profile, isFocused) {
  const currentIndex = stageCurrentIndex(profile);
  const currentStage = stageDefinitions[currentIndex] || stageDefinitions[stageDefinitions.length - 1];
  return `
    <div class="stage-row ${isFocused ? "focused" : ""}">
      <div class="stage-label">
        <strong>${escapeHtml(profile.project)}</strong>
        <small>${escapeHtml(currentStage.label)} stage • ${gateReadinessText(profile, "current")}</small>
      </div>
      ${stageDefinitions.map((stage, index) => StageCell(profile, stage, index, isFocused)).join("")}
    </div>
  `;
}

function PortfolioStageStep(profile, stage, index) {
  const status = stageStatus(profile, index);
  return `
    <span class="portfolio-flow-step ${status}" aria-label="${escapeHtml(`${stage.label}: ${stageStatusLabel(status)}`)}">
      <i>${index + 1}</i>
      <b>${escapeHtml(stage.label)}</b>
    </span>
  `;
}

function PortfolioStageRow(profile) {
  const currentIndex = stageCurrentIndex(profile);
  const currentStage = stageDefinitions[currentIndex] || stageDefinitions[stageDefinitions.length - 1];
  return `
    <article class="portfolio-stage-row ${profile.tone}">
      <div class="portfolio-stage-project">
        <strong>${escapeHtml(profile.project)}</strong>
        <span>${escapeHtml(currentStage.label)} stage • ${profile.gateDone}/${profile.gateTotal} ready</span>
      </div>
      <div class="portfolio-stage-flow" aria-label="${escapeHtml(`${profile.project} lifecycle stage flow`)}">
        ${stageDefinitions.map((stage, index) => PortfolioStageStep(profile, stage, index)).join("")}
      </div>
      <div class="portfolio-stage-status">
        <strong>${escapeHtml(currentStage.label)}</strong>
        <span>${profile.gateDone}/${profile.gateTotal} ready</span>
        <span>Due ${escapeHtml(profile.gateDue)}</span>
      </div>
      <button
        class="portfolio-stage-action"
        type="button"
        data-stage-gate="${escapeHtml(stageGateKey(profile.project, currentStage.id))}"
        aria-label="${escapeHtml(`Open ${profile.project} ${currentStage.gate}`)}"
      >
        <span>${escapeHtml(stageGateButtonLabel("current"))}</span>
        ${icon("arrow")}
      </button>
    </article>
  `;
}

function PortfolioStagesOverview(profiles) {
  return `
    <div class="portfolio-stage-overview">
      ${profiles.length ? profiles.map(PortfolioStageRow).join("") : `<div class="timeline-empty">No stage data for assigned projects</div>`}
    </div>
  `;
}

function StagesView(selectedProject, selectedView) {
  const profiles = stageProfilesForSelection(selectedProject);
  const isPortfolio = isAllProjects(selectedProject);
  const currentSummary = isPortfolio
    ? `${profiles.length} assigned projects shown`
    : `${projectName(selectedProject)} stage breakdown`;
  return `
    <div class="stages-view ${selectedView === "stages" ? "" : "is-hidden"}" data-work-view="stages">
      <div class="view-toolbar">
        <div>
          <strong>${isPortfolio ? "All assigned project stages" : `${projectName(selectedProject)} stages`}</strong>
          <span>${currentSummary}. ${isPortfolio ? "Review current stage readiness without the full gate matrix." : "Open a stage gate to review the checklist and submit readiness."}</span>
        </div>
        <div class="stage-legend ${isPortfolio ? "is-hidden" : ""}" aria-label="Stage legend">
          <span><i class="complete"></i> Complete</span>
          <span><i class="current"></i> Current</span>
          <span><i class="upcoming"></i> Upcoming</span>
        </div>
      </div>
      ${isPortfolio ? PortfolioStagesOverview(profiles) : `<div class="stage-work" style="--stage-count:${stageDefinitions.length}">
        <div class="stage-header">
          <span>${isPortfolio ? "Project" : "Project"}</span>
          ${stageDefinitions.map((stage) => `<span>${escapeHtml(stage.label)}</span>`).join("")}
        </div>
        ${profiles.length ? profiles.map((profile) => StageRow(profile, !isPortfolio)).join("") : `<div class="timeline-empty">No stage data for ${projectName(selectedProject)}</div>`}
        <div class="timeline-footnote">${profiles.length} ${isPortfolio ? "projects" : "project"} shown. Stage gates open in the right drawer.</div>
      </div>`}
    </div>
  `;
}

function WorkspacePanel(selectedProject, selectedView, selectedRange, selectedBoardFilter, selectedCalendarMonth) {
  const workspaceTitle = isAllProjects(selectedProject)
    ? "Operational Workspace"
    : `${projectName(selectedProject)} | Operational Workspace`;

  return `
    <section class="workspace-panel ${isAllProjects(selectedProject) ? "" : "project-workspace-panel"}">
      <div class="workspace-shell-head">
        <div class="workspace-title">
          <h2>${escapeHtml(workspaceTitle)}</h2>
          <p>Plan this month, clear overdue work, and track stage-gates without opening every project.</p>
        </div>
        ${AIInsightsWidget(selectedProject)}
        ${WorkspaceTabs(selectedView)}
      </div>
      ${
        selectedView === "stages"
          ? ""
          : `<div class="workspace-control-row">
          ${WorkspaceSearch(selectedView)}
          ${ActionViewSwitch(selectedView)}
        </div>
      `
      }
      <div class="workspace-body">
        ${BoardView(selectedProject, selectedView, selectedBoardFilter)}
        ${CalendarView(selectedProject, selectedView, selectedBoardFilter, selectedCalendarMonth)}
        ${StagesView(selectedProject, selectedView)}
      </div>
    </section>
  `;
}

function ReportStatusIcon(status) {
  const visual = reportVisualStatus(status);
  return `<span class="report-status-icon ${visual.className}" aria-hidden="true">${icon(visual.icon)}</span>`;
}

function reportDueToneLabel(tone) {
  if (tone === "red") return "Off track";
  if (tone === "amber") return "Alert";
  if (tone === "green") return "On track";
  return "Review";
}

function reportFrontdoorTone(report) {
  const toneOverrides = {
    "Vision 2030": "red",
    "NEOM Integration": "green",
    "PMO Capability": "amber",
  };
  return toneOverrides[report.project] || report.dueTone;
}

function ReportHealthChip(report, tone = report.dueTone) {
  return `<span class="report-health-chip ${tone}">${escapeHtml(reportDueToneLabel(tone))}</span>`;
}

function reportDueText(report) {
  if (report.dueLabel === "Overdue 5 days") return "Overdue by 5 days";
  return report.dueLabel;
}

function portfolioReportRows(rows) {
  const reportOrder = ["Vision 2030", "NEOM Integration", "PMO Capability"];
  const byProject = new Map(rows.map((report) => [report.project, report]));
  const ordered = reportOrder.map((project) => byProject.get(project)).filter(Boolean);
  return ordered.length ? ordered : rows.slice(0, 3);
}

function portfolioReportTrend() {
  return [
    { label: "Mar", status: "submitted", date: "Mar 18, 2026" },
    { label: "Apr", status: "attention", date: "Apr 18, 2026" },
    { label: "May", status: "overdue", date: "May 10, 2026" },
  ];
}

function ReportTrend(trend, report = null) {
  const visibleTrend = trend.slice(-3);
  const firstVisibleIndex = trend.length - visibleTrend.length;

  return `
    <div class="report-trend" style="--report-trend-count:${visibleTrend.length}" aria-label="Status report trend">
      ${visibleTrend
        .map(
          (point, index) => `
            <span
              class="report-trend-point ${reportStatusTone(point.status)}"
              tabindex="0"
              data-report-point
              data-report-project="${escapeHtml(report?.project || "All projects")}"
              data-report-interval="${escapeHtml(point.label)}"
              data-report-status="${escapeHtml(reportVisualStatus(point.status).label)}"
              data-report-detail="${escapeHtml(reportStatusDetail(point, firstVisibleIndex + index))}"
              data-report-cadence="${escapeHtml(report?.cadence || "Portfolio")}"
              data-report-next="${escapeHtml(report?.nextDue || "Mixed")}"
            >
              ${ReportStatusIcon(point.status)}
              <small>${escapeHtml(point.label)}</small>
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

function ReportWidget(selectedProject) {
  const rows = reportRowsForSelection(selectedProject);
  if (!rows.length) return "";
  const isPortfolio = isAllProjects(selectedProject);
  const headline = isPortfolio ? "Reporting trends" : "Project report trend";
  const visibleRows = isPortfolio ? portfolioReportRows(rows) : rows;

  return `
    <section class="side-card report-widget ${isPortfolio ? "portfolio-report-widget" : ""}" data-tour-target="right-report-widget">
      <div class="report-widget-head">
        <div>
          <h2>${escapeHtml(headline)}</h2>
          <small>Last 3 PSR statuses</small>
        </div>
      </div>
      <div class="report-trend-list">
        ${visibleRows
          .map(
            (report) => {
              const tone = reportFrontdoorTone(report);
              return `
                <article class="report-trend-row ${tone}">
                  <div class="report-trend-row-head">
                    <strong>${escapeHtml(report.project)}</strong>
                    ${ReportHealthChip(report, tone)}
                  </div>
                  ${ReportTrend(isPortfolio ? portfolioReportTrend() : report.trend, report)}
                  <div class="report-trend-row-foot">
                    <span class="report-row-due">
                      ${icon("history")}
                      <span>${escapeHtml(reportDueText(report))}</span>
                    </span>
                    <button class="report-row-create" type="button" data-report-create="${escapeHtml(report.project)}">
                      ${icon("plan")}
                      <span>Create</span>
                    </button>
                  </div>
                </article>
              `;
            }
          )
          .join("")}
      </div>
    </section>
  `;
}

function QuickLinks(selectedProject) {
  return `
    <section class="side-card context-card quick-actions-card">
      <div class="quick-card-head">
        <h2>Quick links</h2>
        <p>${escapeHtml(projectName(selectedProject))} shortcuts</p>
      </div>
      <div class="quick-action-list">
        ${projectQuickActions
          .map(
            ({ title, icon: iconName, page }) => `
              <button class="quick-action" type="button" aria-label="${escapeHtml(`${title} for ${projectName(selectedProject)}`)}" ${page ? `data-page-target="${escapeHtml(page)}"` : ""}>
                <span class="quick-action-icon">${icon(iconName)}</span>
                <span class="quick-action-label">${title}</span>
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function ProjectScopeHero(project, options = {}) {
  const details = projectPlaygroundDetails[project] || projectPlaygroundDetails["Vision 2030"];
  const planStatus = options.planStatus || "Endorsed";
  const planTone = options.planTone || "purple";
  const showModeTabs = Boolean(options.showModeTabs);

  return `
    <header class="project-plan-hero plan-builder-hero project-scope-hero ${showModeTabs ? "has-inline-mode" : ""}">
      <img class="project-plan-hero-art" src="./assets/workspace-line-art.svg" alt="" aria-hidden="true" />
      <div class="project-plan-hero-inner">
        <div class="project-plan-summary">
          <div class="project-plan-title plan-builder-title">
            <h1>${escapeHtml(project)}</h1>
            <span>Category</span>
          </div>
          <div class="project-plan-meta">
            <span>Stage: <b class="blue">${escapeHtml(details.stage)}</b></span>
            <span>State: <b class="green">Active</b></span>
            <span>Plan: <b class="${escapeHtml(planTone)}">${escapeHtml(planStatus)}</b></span>
          </div>
        </div>
        ${showModeTabs ? ProjectModeTabs("project-plan", { inline: true }) : ""}
      </div>
    </header>
  `;
}

function ProjectModeTabs(activePage, options = {}) {
  const inline = Boolean(options.inline);
  const tabs = inline
    ? [
        { label: "Project Plan", page: "project-plan", entry: "quick" },
        { label: "Report", page: null },
      ]
    : [
        { label: "Project Plan", page: "project-plan", entry: "quick" },
        { label: "Project Playground", page: "playground" },
        { label: "Reporting", page: null },
      ];

  return `
    <div class="plan-builder-modebar project-modebar ${inline ? "project-modebar-inline" : ""}" aria-label="Project workspace mode">
      <div class="plan-builder-mode-toggle project-mode-toggle">
        ${tabs
          .map(
            ({ label, page, entry }) => `
              <button class="${page === activePage ? "active" : ""}" type="button" ${page ? `data-page-target="${page}"` : ""} ${entry ? `data-plan-entry="${entry}"` : ""}>
                ${escapeHtml(label)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function ProjectPlanContentModeToggle() {
  return `
    <div class="project-plan-content-modebar" aria-label="Project plan detail mode">
      <div class="project-plan-detail-toggle" role="tablist" aria-label="Project plan detail mode">
        <button class="${projectPlanDetailMode === "simple" ? "active" : ""}" type="button" role="tab" aria-selected="${projectPlanDetailMode === "simple"}" data-plan-detail-mode="simple">Simple</button>
        <button class="${projectPlanDetailMode === "detailed" ? "active" : ""}" type="button" role="tab" aria-selected="${projectPlanDetailMode === "detailed"}" data-plan-detail-mode="detailed">Detailed</button>
      </div>
    </div>
  `;
}

const projectPlanSectionOrder = [
  "Project Setup",
  "Overview",
  "Schedule & Scope",
  "Budget",
  "Benefits",
  "Risk",
  "Issues",
  "Change Impact",
  "Related Links",
  "Resource",
  "Dependency",
  "Miscellaneous",
];

const projectPlanDetailedPrimarySections = ["Project Setup", "Overview", "Schedule & Scope", "Budget", "Benefits", "Risk", "Resource"];
const projectPlanDetailedOnlySections = projectPlanSectionOrder.filter((section) => !projectPlanDetailedPrimarySections.includes(section));

const projectPlanFieldMatrix = [
  { section: "Project Setup", field: "Project name", mandatory: true, simple: true, intermediate: true, detailed: true, type: "text", value: "UAE Research Map" },
  { section: "Project Setup", field: "Description", simple: false, intermediate: true, detailed: true, type: "textarea", value: "A centralized map for national research capabilities, partners, and funding touchpoints." },
  { section: "Project Setup", field: "Category", simple: true, intermediate: true, detailed: true, type: "select", value: "Research & Development", options: ["Research & Development", "Digital Transformation", "Operations", "Compliance"] },
  { section: "Project Setup", field: "Project Source", simple: false, intermediate: false, detailed: true, type: "select", value: "Strategic plan", options: ["Strategic plan", "Audit finding", "PMO request", "Business unit request"] },
  { section: "Project Setup", field: "Is the Project Mandatory", simple: false, intermediate: true, detailed: true, type: "boolean", value: "No" },
  { section: "Project Setup", field: "Portfolio / Program", simple: false, intermediate: true, detailed: true, type: "select", value: "Innovation portfolio", options: ["Innovation portfolio", "Digital services", "Corporate services", "Standalone"] },
  { section: "Project Setup", field: "Governance Board(s)/Forum(s)", simple: false, intermediate: false, detailed: true, type: "text", value: "PMO Steering Forum" },
  { section: "Project Setup", field: "Business Unit", simple: true, intermediate: true, detailed: true, type: "select", value: "Research Office", options: ["Research Office", "Strategy", "Corporate Services", "Technology"] },
  { section: "Project Setup", field: "Project Initiator", simple: false, intermediate: false, detailed: true, type: "text", value: "Research Strategy Team" },
  { section: "Project Setup", field: "Project Director", simple: false, intermediate: true, detailed: true, type: "text", value: "Muna Hassan" },
  { section: "Project Setup", field: "Project Manager", simple: true, intermediate: true, detailed: true, type: "text", value: "Muna Hassan" },
  { section: "Project Setup", field: "Senior User", simple: false, intermediate: true, detailed: true, type: "text", value: "Research Leads Forum" },
  { section: "Project Setup", field: "Delivery Manager", simple: false, intermediate: false, detailed: true, type: "text", value: "Delivery Office" },
  { section: "Project Setup", field: "PMO Contact", mandatory: true, simple: true, intermediate: true, detailed: true, type: "text", value: "PMO Desk" },
  { section: "Project Setup", field: "Change Manager", simple: false, intermediate: true, detailed: true, type: "text", value: "Change team" },
  { section: "Project Setup", field: "Senior Supplier", simple: false, intermediate: false, detailed: true, type: "text", value: "TBD" },
  { section: "Overview", field: "Opportunity or Problem Statement", simple: true, intermediate: true, detailed: true, type: "textarea", value: "The UAE’s research ecosystem is fragmented and lacks a centralized, up-to-date platform to efficiently discover, connect, and leverage national R&D capabilities." },
  { section: "Overview", field: "Business Drivers", simple: false, intermediate: true, detailed: true, type: "table", value: "Strategic research visibility" },
  { section: "Overview", field: "Driver for change / Analysis undertaken", simple: false, intermediate: false, detailed: true, type: "textarea", value: "Stakeholder mapping and portfolio reporting gaps indicate a need for a single research capability index." },
  { section: "Overview", field: "Outcome", simple: true, intermediate: true, detailed: true, type: "table", value: "Reduce fragmentation in research efforts" },
  { section: "Overview", field: "Project Alignment (Objectives)", simple: false, intermediate: true, detailed: true, type: "table", value: "Boost regional sustainability and growth through partnerships and investment" },
  { section: "Overview", field: "Link Capabilities", simple: false, intermediate: false, detailed: true, type: "table", value: "Regulatory Assurance" },
  { section: "Overview", field: "Link Services", simple: false, intermediate: false, detailed: true, type: "table", value: "Material Master Maintenance" },
  { section: "Overview", field: "AI component", mandatory: true, simple: true, intermediate: true, detailed: true, type: "boolean", value: "No" },
  { section: "Schedule & Scope", field: "Baseline Start date", simple: true, intermediate: true, detailed: true, type: "date", value: "2026-05-01" },
  { section: "Schedule & Scope", field: "Baseline End date", simple: true, intermediate: true, detailed: true, type: "date", value: "2026-12-31" },
  { section: "Schedule & Scope", field: "Forecast Start date", simple: false, intermediate: true, detailed: true, type: "date", value: "2026-05-08" },
  { section: "Schedule & Scope", field: "Forecast End date", simple: false, intermediate: true, detailed: true, type: "date", value: "2026-12-31" },
  { section: "Schedule & Scope", field: "Milestones", simple: false, intermediate: true, detailed: true, type: "table", value: "Initiation gate" },
  { section: "Schedule & Scope", field: "Stages", simple: false, intermediate: false, detailed: true, type: "select", value: "Initiation", options: ["Initiation", "Planning", "Execution", "Closure"] },
  { section: "Schedule & Scope", field: "In Scope", simple: true, intermediate: true, detailed: true, type: "textarea", value: "Research entities, universities, government stakeholders, industry partners, funding bodies, and R&D capability records." },
  { section: "Schedule & Scope", field: "Out of Scope", simple: false, intermediate: false, detailed: true, type: "textarea", value: "Procurement execution, detailed grant administration, and non-research capability catalogues." },
  { section: "Schedule & Scope", field: "End Product (Deliverables)", simple: false, intermediate: false, detailed: true, type: "table", value: "Research capability map" },
  { section: "Schedule & Scope", field: "Management Product", simple: false, intermediate: false, detailed: true, type: "table", value: "Project initiation documentation" },
  { section: "Schedule & Scope", field: "Detailed WBS", simple: false, intermediate: false, detailed: true, type: "table", value: "Discovery and data model" },
  { section: "Budget", field: "CAPEX Baseline (FY)", simple: true, intermediate: true, detailed: true, type: "money", value: "1,200,000" },
  { section: "Budget", field: "OPEX Baseline (FY)", simple: true, intermediate: true, detailed: true, type: "money", value: "420,000" },
  { section: "Budget", field: "CAPEX Forecast (FY)", simple: false, intermediate: true, detailed: true, type: "money", value: "1,180,000" },
  { section: "Budget", field: "OPEX Forecast (FY)", simple: false, intermediate: true, detailed: true, type: "money", value: "435,000" },
  { section: "Budget", field: "Funding Sources", simple: false, intermediate: false, detailed: true, type: "table", value: "Innovation fund" },
  { section: "Budget", field: "Monthly Budget Detail", simple: false, intermediate: false, detailed: true, type: "table", value: "Monthly phasing" },
  { section: "Budget", field: "Budget Rules", simple: false, intermediate: false, detailed: true, type: "textarea", value: "Budget revisions require PMO review and sponsor approval before baseline changes are accepted." },
  { section: "Benefits", field: "Benefits Register", simple: false, intermediate: true, detailed: true, type: "table", value: "Improved research discovery" },
  { section: "Risk", field: "Risks Register", simple: true, intermediate: true, detailed: true, type: "table", value: "Stakeholder data quality" },
  { section: "Issues", field: "Issues Register", simple: false, intermediate: false, detailed: true, type: "table", value: "Open PMO decisions" },
  { section: "Change Impact", field: "Change Impact Assessment", simple: false, intermediate: false, detailed: true, type: "table", value: "Process adoption impact" },
  { section: "Related Links", field: "Related Links / Documents", simple: false, intermediate: false, detailed: true, type: "table", value: "Research source pack" },
  { section: "Resource", field: "Resource Plan", simple: false, intermediate: true, detailed: true, type: "table", value: "PM, analyst, data steward" },
  { section: "Dependency", field: "Predecessor Project(s)", simple: false, intermediate: false, detailed: true, type: "table", value: "Data source onboarding" },
  { section: "Dependency", field: "Successor Project(s)", simple: false, intermediate: false, detailed: true, type: "table", value: "Research portal rollout" },
  { section: "Miscellaneous", field: "Old and Unsupportable Systems", simple: false, intermediate: false, detailed: true, type: "boolean", value: "No" },
  { section: "Miscellaneous", field: "High Maintenance Cost", simple: false, intermediate: false, detailed: true, type: "boolean", value: "No" },
  { section: "Miscellaneous", field: "Out of Scope (legacy)", simple: false, intermediate: false, detailed: true, type: "textarea", value: "" },
  { section: "Miscellaneous", field: "ICT Component", simple: false, intermediate: false, detailed: true, type: "boolean", value: "Yes" },
  { section: "Miscellaneous", field: "Number of Assurance/Compliance Reviews Completed", simple: false, intermediate: false, detailed: true, type: "number", value: "0" },
  { section: "Miscellaneous", field: "Number of Recommendations Open", simple: false, intermediate: false, detailed: true, type: "number", value: "0" },
  { section: "Miscellaneous", field: "Number of Recommendations Closed", simple: false, intermediate: false, detailed: true, type: "number", value: "0" },
  { section: "Miscellaneous", field: "Commentary of admins", simple: false, intermediate: false, detailed: true, type: "textarea", value: "" },
].map((field) => ({ ...field, id: slugifyPlanField(`${field.section}-${field.field}`), mandatory: Boolean(field.mandatory) }));

function slugifyPlanField(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectPlanFieldsForSection(section) {
  return projectPlanFieldMatrix.filter((field) => field.section === section);
}

function isProjectPlanDetailedOnlyField(field) {
  return field.detailed && !field.intermediate;
}

function ProjectPlanQuickPage(planProject) {
  const isSimple = projectPlanDetailMode === "simple";
  const activeSection = projectPlanActiveDetailedSection();
  return `
    <section class="project-plan-page plan-builder-page has-project-modebar ${isSimple ? "simple-plan-mode" : "detailed-plan-mode"}" aria-label="${escapeHtml(`${planProject} project plan`)}">
      ${ProjectScopeHero(planProject, { showModeTabs: true })}
      <div class="project-plan-shell plan-builder-shell quick-plan-shell ${isSimple ? "simple-plan-shell" : "detailed-plan-shell"}">
        ${isSimple ? "" : ProjectPlanDetailedNav(activeSection)}
        <main class="project-plan-content plan-builder-workspace quick-plan-workspace ${isSimple ? "simple-plan-workspace" : "detailed-plan-workspace"}">
          ${ProjectPlanContentModeToggle()}
          <div class="plan-builder-main quick-plan-main project-plan-matrix-main">
            ${isSimple ? ProjectPlanSimpleContent() : ProjectPlanDetailedContent(activeSection)}
          </div>
        </main>
      </div>
    </section>
  `;
}

function projectPlanVisibleDetailedSections() {
  return projectPlanSectionsExpanded ? projectPlanSectionOrder : projectPlanDetailedPrimarySections;
}

function projectPlanActiveDetailedSection() {
  const visibleSections = projectPlanVisibleDetailedSections();
  return visibleSections.includes(projectPlanActiveSection) ? projectPlanActiveSection : "Overview";
}

function ProjectPlanDetailedNav(activeSection) {
  const detailedOnlyVisible = projectPlanSectionsExpanded;
  const detailedOnlyPreview = projectPlanDetailedOnlySections.join(", ");
  const renderSectionButton = (section, detailedOnly = false) => `
    <button
      class="${section === activeSection ? "active" : ""} ${detailedOnly ? "detailed-only" : ""}"
      type="button"
      data-plan-section="${escapeHtml(section)}"
    >
      <span>${escapeHtml(section)}</span>
      ${detailedOnly ? "<small>Detailed</small>" : ""}
    </button>
  `;

  return `
    <aside class="project-plan-sections plan-builder-nav quick-plan-nav matrix-plan-nav" aria-label="Project plan sections">
      ${projectPlanDetailedPrimarySections.map((section) => renderSectionButton(section)).join("")}
      <button
        class="matrix-show-sections ${detailedOnlyVisible ? "is-expanded" : ""}"
        type="button"
        data-plan-show-more-sections
        aria-expanded="${detailedOnlyVisible}"
      >
        <span class="matrix-show-sections-copy">
          <strong>Additional sections (${projectPlanDetailedOnlySections.length})</strong>
          <small>${escapeHtml(detailedOnlyPreview)}</small>
        </span>
        <span class="matrix-show-sections-indicator" aria-hidden="true">${icon(detailedOnlyVisible ? "minus" : "plus")}</span>
      </button>
      ${
        detailedOnlyVisible
          ? `<div class="matrix-extra-sections">${projectPlanDetailedOnlySections.map((section) => renderSectionButton(section, true)).join("")}</div>`
          : ""
      }
    </aside>
  `;
}

function ProjectPlanSimpleContent() {
  const fields = projectPlanFieldMatrix.filter((field) => field.simple);
  const fieldMap = new Map(fields.map((field) => [field.field, field]));
  const simpleGroups = [
    {
      title: "Project identity",
      icon: "project",
      description: "Name the project and confirm who owns the first PMO handoff.",
      fields: ["Project name", "Category", "Business Unit", "Project Manager", "PMO Contact"],
    },
    {
      title: "Purpose and outcome",
      icon: "info",
      description: "Explain why this work exists and what success should produce.",
      fields: ["Opportunity or Problem Statement", "Outcome", "AI component"],
    },
    {
      title: "Timeline and scope",
      icon: "calendar",
      description: "Set the baseline dates and make the included work easy to review.",
      fields: ["Baseline Start date", "Baseline End date", "In Scope"],
    },
    {
      title: "Budget baseline",
      icon: "dollar",
      description: "Capture the first approved funding view before detailed phasing.",
      fields: ["CAPEX Baseline (FY)", "OPEX Baseline (FY)"],
    },
    {
      title: "First watch item",
      icon: "risks",
      description: "Log the first risk PMO should see before endorsement.",
      fields: ["Risks Register"],
    },
  ];

  return `
    <section class="project-plan-form-card plan-builder-card project-plan-matrix-card simple-plan-card">
      <div class="project-overview-head project-plan-matrix-head">
        <h2>Build the project plan in five clear steps</h2>
        <p>Start with the fields PMO needs first. Detailed registers can be refined after the plan is endorsed.</p>
      </div>
      <div class="simple-plan-sections">
        ${simpleGroups
          .map((group) => {
            const groupFields = group.fields.map((fieldName) => fieldMap.get(fieldName)).filter(Boolean);
            return `
              <article class="simple-plan-section-card">
                <header>
                  <span class="simple-plan-section-icon">${icon(group.icon)}</span>
                  <div>
                    <h3>${escapeHtml(group.title)}</h3>
                    <p>${escapeHtml(group.description)}</p>
                  </div>
                </header>
                <div class="simple-plan-section-fields">
                  ${groupFields.map((field) => ProjectPlanFieldControl(field, { simple: true })).join("")}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function ProjectPlanDetailedContent(section) {
  const fields = projectPlanFieldsForSection(section);
  const isDetailedOnlySection = projectPlanDetailedOnlySections.includes(section);
  const upfrontFields = isDetailedOnlySection ? fields : fields.filter((field) => field.intermediate);
  const hiddenFields = isDetailedOnlySection ? [] : fields.filter(isProjectPlanDetailedOnlyField);
  const expanded = Boolean(projectPlanExpandedFieldSections[section]);
  const visibleHiddenFields = expanded ? hiddenFields : [];
  const hiddenFieldPreview = hiddenFields.map((field) => field.field).join(", ");
  const hiddenFieldAccordion = hiddenFields.length
    ? `<button
        class="matrix-show-fields ${expanded ? "is-expanded" : ""}"
        type="button"
        data-plan-show-more-fields="${escapeHtml(section)}"
        aria-expanded="${expanded}"
      >
        <span class="matrix-show-fields-copy">
          <strong>Additional detailed fields (${hiddenFields.length})</strong>
          <small>${escapeHtml(hiddenFieldPreview)}</small>
        </span>
        <span class="matrix-show-fields-indicator" aria-hidden="true">${icon(expanded ? "minus" : "plus")}</span>
      </button>
      ${
        expanded
          ? `<div class="matrix-hidden-fields is-expanded">
              ${visibleHiddenFields.map((field) => ProjectPlanFieldControl(field, { detailedOnly: true })).join("")}
            </div>`
          : ""
      }`
    : "";

  return `
    <section class="project-plan-form-card plan-builder-card project-plan-matrix-card detailed-plan-card">
      <div class="project-overview-head project-plan-matrix-head">
        <span>${isDetailedOnlySection ? "Detailed section" : "Detailed"}</span>
        <h2>${escapeHtml(section)}</h2>
        <p>${escapeHtml(projectPlanSectionDescription(section, upfrontFields.length, hiddenFields.length, isDetailedOnlySection))}</p>
      </div>
      <div class="project-plan-section-fields">
        ${upfrontFields.map((field) => ProjectPlanFieldControl(field)).join("")}
        ${hiddenFieldAccordion}
      </div>
    </section>
  `;
}

function projectPlanSectionDescription(section, upfrontCount, hiddenCount, isDetailedOnlySection) {
  if (isDetailedOnlySection) {
    return `${section} is a detailed-only section from the field matrix.`;
  }
  if (hiddenCount) {
    return `${upfrontCount} intermediate field${upfrontCount === 1 ? "" : "s"} are shown upfront. ${hiddenCount} detailed-only field${hiddenCount === 1 ? "" : "s"} can be expanded.`;
  }
  return `${upfrontCount} intermediate field${upfrontCount === 1 ? "" : "s"} from the field matrix.`;
}

function ProjectPlanFieldControl(field, options = {}) {
  const label = `
    <span class="matrix-field-label">
      ${escapeHtml(field.field)}
      ${field.mandatory ? "<b>*</b>" : ""}
      ${options.detailedOnly ? "<small>Detailed only</small>" : ""}
    </span>
  `;
  const classes = [
    "matrix-field",
    `matrix-field-${field.type}`,
    field.type === "textarea" || field.type === "table" ? "wide" : "",
    field.mandatory ? "is-required" : "",
    options.simple ? "simple-field-control" : "",
    ]
    .filter(Boolean)
    .join(" ");

  if (field.type === "boolean") {
    return `
      <div class="${classes}">
        ${label}
        <div class="matrix-boolean" role="radiogroup" aria-label="${escapeHtml(field.field)}">
          <label><input type="radio" name="${escapeHtml(field.id)}" ${field.value === "Yes" ? "checked" : ""} /> <span>Yes</span></label>
          <label><input type="radio" name="${escapeHtml(field.id)}" ${field.value !== "Yes" ? "checked" : ""} /> <span>No</span></label>
        </div>
      </div>
    `;
  }

  if (field.type === "select") {
    return `
      <label class="${classes}">
        ${label}
        <span class="matrix-select-wrap">
          <select aria-label="${escapeHtml(field.field)}">
            ${(field.options || [field.value || "Select"]).map((option) => `<option ${option === field.value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
          ${icon("down")}
        </span>
      </label>
    `;
  }

  if (field.type === "textarea") {
    return `
      <label class="${classes}">
        ${label}
        <textarea aria-label="${escapeHtml(field.field)}" placeholder="${escapeHtml(projectPlanPlaceholder(field))}">${escapeHtml(field.value || "")}</textarea>
      </label>
    `;
  }

  if (field.type === "money") {
    return `
      <label class="${classes}">
        ${label}
        <span class="matrix-money-wrap">
          <small>SAR</small>
          <input type="text" value="${escapeHtml(field.value || "")}" aria-label="${escapeHtml(field.field)}" />
        </span>
      </label>
    `;
  }

  if (field.type === "number") {
    return `
      <label class="${classes}">
        ${label}
        <input type="number" min="0" value="${escapeHtml(field.value || "0")}" aria-label="${escapeHtml(field.field)}" />
      </label>
    `;
  }

  if (field.type === "date") {
    return `
      <label class="${classes}">
        ${label}
        <input type="date" value="${escapeHtml(field.value || "")}" aria-label="${escapeHtml(field.field)}" />
      </label>
    `;
  }

  if (field.type === "table") {
    if (options.simple) {
      return ProjectPlanCompactRegisterField(field, label, classes);
    }
    return ProjectPlanRegisterField(field, label, classes);
  }

  return `
    <label class="${classes}">
      ${label}
      <input type="text" value="${escapeHtml(field.value || "")}" placeholder="${escapeHtml(projectPlanPlaceholder(field))}" aria-label="${escapeHtml(field.field)}" />
    </label>
  `;
}

function ProjectPlanCompactRegisterField(field, label, classes) {
  const row = projectPlanRegisterRows(field)[0];
  return `
    <article class="${classes} simple-register-field">
      <div class="simple-register-copy">
        ${label}
        <strong>${escapeHtml(row.name)}</strong>
        <small>${escapeHtml(row.owner)} · ${escapeHtml(row.status)}</small>
      </div>
      <button type="button">${icon("plus")} Add item</button>
    </article>
  `;
}

function ProjectPlanRegisterField(field, label, classes) {
  const rows = projectPlanRegisterRows(field);
  return `
    <article class="${classes}">
      <div class="matrix-register-head">
        ${label}
        <button type="button">${icon("plus")} Add</button>
      </div>
      <div class="matrix-register-table" role="table" aria-label="${escapeHtml(field.field)}">
        <div class="matrix-register-row head" role="row">
          <span>Name</span>
          <span>Owner</span>
          <span>Status</span>
        </div>
        ${rows
          .map(
            (row) => `
              <div class="matrix-register-row" role="row">
                <span>${escapeHtml(row.name)}</span>
                <span>${escapeHtml(row.owner)}</span>
                <span><b>${escapeHtml(row.status)}</b></span>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function projectPlanRegisterRows(field) {
  const name = field.value || field.field;
  if (field.field.includes("Budget")) {
    return [{ name, owner: "Finance", status: "Draft" }];
  }
  if (field.field.includes("Risk")) {
    return [{ name, owner: "PMO", status: "Open" }];
  }
  if (field.field.includes("Milestone")) {
    return [{ name, owner: "Project Manager", status: "Planned" }];
  }
  if (field.field.includes("Resource")) {
    return [{ name, owner: "Muna Hassan", status: "Planned" }];
  }
  if (field.field.includes("Dependencies") || field.section === "Dependency") {
    return [{ name, owner: "PMO", status: "Tracking" }];
  }
  return [{ name, owner: "Project Manager", status: "Draft" }];
}

function projectPlanPlaceholder(field) {
  if (field.type === "textarea") return `Add ${field.field.toLowerCase()}`;
  return `Enter ${field.field.toLowerCase()}`;
}

function RightRail(selectedProject) {
  if (isAllProjects(selectedProject)) {
    return `
      ${TopDeck()}
      ${ReportWidget(selectedProject)}
    `;
  }

  return `
    ${ReportWidget(selectedProject)}
    ${QuickLinks(selectedProject)}
  `;
}

function UnassignedFrontDoor() {
  const assigned = pmoAssignmentReady;
  return `
    <section class="unassigned-frontdoor ${assigned ? "assignment-ready" : ""}" aria-label="${assigned ? "Project assigned" : "No projects assigned yet"}">
      <div class="unassigned-hero">
        <div class="unassigned-hero-copy">
          <span class="unassigned-kicker">${assigned ? "PMO assignment received" : "New PM workspace"}</span>
          <h1>${assigned ? "Your first project is ready to plan" : "Welcome to your PM front door"}</h1>
          <p>${
            assigned
              ? `PMO assigned ${firstAssignedProject.name} to your workspace. Start with the project plan, then submit it for review before delivery tracking begins.`
              : "No projects have been assigned to you yet. We’ll notify you when PMO assigns one. Meanwhile, here is what this workspace will help you do once your project is ready."
          }</p>
          <button class="unassigned-status-pill ${assigned ? "is-ready" : ""}" type="button" ${assigned ? "data-page-target=\"project-plan\"" : "data-pmo-assignment-trigger"} aria-label="${assigned ? "Create project plan" : "Simulate PMO project assignment"}">
            ${icon(assigned ? "plan" : "bell")}
            <span>${assigned ? "Create project plan" : "Waiting for PMO assignment"}</span>
          </button>
        </div>
      </div>

      <div class="unassigned-layout">
        <section class="unassigned-card journey-card">
          <div class="journey-overview">
            <div class="unassigned-section-head journey-heading">
              <span>What happens next</span>
              <h2>Your project management journey</h2>
              <p>From assignment to regular reporting, these are the steps you will work through in TASAMA.</p>
            </div>
            <div class="journey-status-panel">
              <span class="journey-status-icon">${icon(assigned ? "plan" : "bell")}</span>
              <div>
                <small>Current state</small>
                <strong>${assigned ? escapeHtml(firstAssignedProject.name) : "Awaiting first assignment"}</strong>
                <p>${assigned ? "Build the baseline plan, then send it for PMO review." : "Your workspace is ready. PMO assignment will unlock project planning."}</p>
              </div>
              <button class="journey-status-action ${assigned ? "is-ready" : ""}" type="button" ${assigned ? "data-page-target=\"project-plan\"" : "data-pmo-assignment-trigger"}>
                ${icon(assigned ? "plan" : "bell")}
                <span>${assigned ? "Create project plan" : "Waiting for PMO assignment"}</span>
              </button>
            </div>
          </div>
          <ol class="journey-map">
            ${unassignedJourneySteps
              .map(
                (step, index) => `
                  <li class="${assigned && index === 0 ? "is-complete" : ""} ${assigned && index === 1 ? "is-current" : ""}">
                    <div class="journey-step-head">
                      <span class="journey-step-icon">${icon(step.icon)}</span>
                      <small>${String(index + 1).padStart(2, "0")}</small>
                    </div>
                    <div class="journey-step-copy">
                      <strong>${escapeHtml(step.title)}</strong>
                      <p>${escapeHtml(step.body)}</p>
                      ${
                        assigned && index === 1
                          ? `<button class="journey-plan-cta" type="button" data-page-target="project-plan">
                              ${icon("plan")}
                              <span>Create project plan</span>
                            </button>`
                          : ""
                      }
                    </div>
                  </li>
                `
              )
              .join("")}
          </ol>
        </section>
      </div>

    </section>
  `;
}

function WbsMetaChips(meta) {
  return `
    <div class="wbs-meta-row" aria-label="Project WBS summary">
      <span>Project Stage <b>${escapeHtml(meta.stage)}</b></span>
      <span>Project State <b class="is-active">${escapeHtml(meta.state)}</b></span>
      <span class="wbs-progress-chip">Project Progress <i><em style="width:${Math.max(0, Math.min(100, meta.progress))}%"></em></i><b>${meta.progress}%</b></span>
    </div>
  `;
}

function WbsHeader(projectId) {
  const meta = wbsProjectMeta(projectId);
  return `
    <header class="wbs-header">
      <div class="wbs-title-stack">
        <button class="wbs-back" type="button" data-page-target="workspace" aria-label="Back to front door">${icon("prev")}</button>
        <div>
          <h1>${escapeHtml(meta.title)}</h1>
          ${WbsMetaChips(meta)}
        </div>
      </div>
      <div class="wbs-header-actions">
        <button class="wbs-text-button" type="button">${icon("split")} Split</button>
        <button class="wbs-text-button" type="button">Extra insights</button>
        <button class="wbs-icon-button" type="button" aria-label="More options">${icon("moreVertical")}</button>
      </div>
    </header>
  `;
}

function WbsToolbar() {
  return `
    <div class="wbs-toolbar">
      <label class="wbs-search">
        <input type="search" value="${escapeHtml(selectedWbsSearch)}" placeholder="Search" aria-label="Search WBS" data-wbs-search />
        ${icon("search")}
      </label>
      <div class="wbs-toolbar-actions">
        <button class="wbs-icon-button ghost" type="button" aria-label="Undo">${icon("undo")}</button>
        <button class="wbs-icon-button ghost" type="button" aria-label="Redo">${icon("redo")}</button>
        <span class="wbs-divider" aria-hidden="true"></span>
        <label class="wbs-view-select">
          <span>View by:</span>
          <select data-wbs-view-by aria-label="View Gantt by">
            <option value="months" ${selectedWbsViewBy === "months" ? "selected" : ""}>Months</option>
            <option value="quarters" ${selectedWbsViewBy === "quarters" ? "selected" : ""}>Quarters</option>
          </select>
          ${icon("down")}
        </label>
        <button class="wbs-filter-button" type="button">${icon("filter")} Filter ${icon("down")}</button>
      </div>
    </div>
  `;
}

function WbsTableTools() {
  return `
    <div class="wbs-table-tools" aria-label="WBS table actions">
      <button type="button" aria-label="Indent item">${icon("indent")}</button>
      <button type="button" aria-label="Outdent item">${icon("outdent")}</button>
      <button type="button" aria-label="Delete item">${icon("trash")}</button>
    </div>
  `;
}

function WbsTableRow(item) {
  const hasChildren = baseWbsItems.some((candidate) => candidate.parent === item.id);
  const typeKey = wbsTypeKey(item.type);
  return `
    <div
      class="wbs-table-row ${item.id === "project" ? "project-row" : ""}"
      data-wbs-row-id="${escapeHtml(item.id)}"
      data-wbs-search-text="${escapeHtml(`${item.code} ${item.title} ${item.type} ${item.owner}`)}"
    >
      <div class="wbs-code-cell">
        <span class="wbs-check"></span>
        <span class="wbs-code">${escapeHtml(item.code)}</span>
        ${item.level > 0 && hasChildren ? `<span class="wbs-signal up"></span>` : ""}
      </div>
      <div class="wbs-name-cell" style="--wbs-indent:${item.level}">
        ${hasChildren ? `<span class="wbs-caret"></span>` : `<span class="wbs-caret-space"></span>`}
        <strong>${escapeHtml(item.title)}</strong>
      </div>
      <div class="wbs-type-cell ${typeKey}">
        ${icon(wbsTypeIcon(item.type))}
        <span>${escapeHtml(item.type)}</span>
      </div>
      <div class="wbs-owner-cell">${escapeHtml(item.owner)}</div>
    </div>
  `;
}

function WbsTimelineRow(item, totalWidth) {
  const metrics = wbsBarMetrics(item, totalWidth);
  const typeKey = wbsTypeKey(item.type);
  const isMilestone = item.type === "Milestone" || item.type === "Stage Gate";
  const progress = Math.max(0, Math.min(100, item.progress || 0));

  return `
    <div
      class="wbs-timeline-row ${item.id === "project" ? "project-row" : ""}"
      data-wbs-row-id="${escapeHtml(item.id)}"
      data-wbs-search-text="${escapeHtml(`${item.code} ${item.title} ${item.type} ${item.owner}`)}"
    >
      ${
        isMilestone
          ? `<span class="wbs-milestone ${typeKey} ${item.status}" style="--left:${metrics.left}px">${icon(wbsTypeIcon(item.type))}</span>`
          : `<span class="wbs-gantt-bar ${typeKey} ${item.status}" style="--left:${metrics.left}px; --width:${metrics.width}px">
              <i style="width:${progress}%"></i>
              <small>${wbsProgressLabel(item)}</small>
            </span>`
      }
    </div>
  `;
}

function WbsTimelineHeader(units, totalWidth) {
  return `
    <div class="wbs-year-row" style="width:${totalWidth}px">2024</div>
    <div class="wbs-month-row" style="width:${totalWidth}px">
      ${units
        .map(
          (unit) => `
            <span style="width:${Math.round(unit.width * selectedWbsZoom)}px">
              <b>${escapeHtml(unit.label)}</b>
              ${unit.caption ? `<small>${escapeHtml(unit.caption)}</small>` : ""}
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

function WbsBottomControls() {
  const zoomLabel = `${Math.round(selectedWbsZoom * 100)}%`;
  const zoomFill = Math.round(((selectedWbsZoom - 0.75) / 0.6) * 100);
  return `
    <footer class="wbs-bottom-strip">
      <div class="wbs-bottom-left">
        <span>Autosave in progress</span>
        <div class="wbs-faux-scroll" aria-hidden="true"><i></i></div>
      </div>
      <div class="wbs-bottom-right">
        <div class="wbs-faux-scroll" aria-hidden="true"><i></i></div>
        <div class="wbs-zoom-control" aria-label="Timeline zoom">
          <button type="button" data-wbs-zoom="out" aria-label="Zoom out">${icon("minus")}</button>
          <span><i style="width:${Math.max(0, Math.min(100, zoomFill))}%"></i></span>
          <button type="button" data-wbs-zoom="in" aria-label="Zoom in">${icon("plus")}</button>
          <b>${zoomLabel}</b>
        </div>
        <button class="wbs-legend-button" type="button">Legend</button>
        <button class="wbs-ai-button" type="button" aria-label="Open WBS insights">${icon("sparkles")}</button>
      </div>
    </footer>
  `;
}

function WbsGanttPage(selectedProject) {
  const projectId = wbsProjectId(selectedProject);
  const items = filteredWbsItems(projectId);
  const units = wbsTimelineUnits(selectedWbsViewBy);
  const totalWidth = wbsTimelineWidth(units);
  const markerLeft = wbsPositionForDate(parseDate("2024-01-10"), totalWidth);
  const empty = items.length === 0;

  return `
    <section class="wbs-page" data-tour-target="wbs-page">
      <div class="wbs-card">
        ${WbsHeader(projectId)}
        ${WbsToolbar()}
        <div class="wbs-gantt-grid" style="--wbs-total:${totalWidth}px; --wbs-cell:${Math.round(units[0].width * selectedWbsZoom)}px">
          <div class="wbs-table-pane">
            ${WbsTableTools()}
            <div class="wbs-table-head">
              <span></span>
              <span>Product or Task Name</span>
              <span>Type</span>
              <span>Person Responsible</span>
            </div>
            <div class="wbs-table-body" data-wbs-table-scroll>
              ${empty ? `<div class="wbs-empty">No WBS items match your search.</div>` : items.map(WbsTableRow).join("")}
            </div>
          </div>
          <div class="wbs-splitter" aria-hidden="true"><span>${icon("grip")}</span></div>
          <div class="wbs-timeline-pane">
            <div class="wbs-timeline-horizontal" data-wbs-timeline-x>
              ${WbsTimelineHeader(units, totalWidth)}
              <div class="wbs-timeline-body" data-wbs-timeline-scroll style="width:${totalWidth}px">
                <span class="wbs-today-marker" style="left:${markerLeft}px"><i></i></span>
                ${empty ? `<div class="wbs-timeline-empty">No matching schedule bars</div>` : items.map((item) => WbsTimelineRow(item, totalWidth)).join("")}
              </div>
            </div>
          </div>
        </div>
        ${WbsBottomControls()}
      </div>
    </section>
  `;
}

function ProjectPlanPage(selectedProject, entryPoint = "quick") {
  const project = selectedProject === firstAssignedProject.id ? firstAssignedProject.name : projectName(selectedProject);
  const planProject = project === "All projects" ? firstAssignedProject.name : project;
  const isQuickLinkPlan = entryPoint !== "onboarding";

  if (isQuickLinkPlan) {
    return ProjectPlanQuickPage(planProject);
  }

  const onboardingSections = [
    { label: "SETUP", type: "label" },
    { label: "Project Basics" },
    { label: "Overview & objectives", active: true },
    { label: "SETUP", type: "label" },
    { label: "Timeline & milestones" },
    "Budget",
    "Risks",
    "Issues",
    "Change Impact",
    "Related links",
    "Resource",
    "Dependancy",
    { label: "REVIEW", type: "label" },
    { label: "Summary & submit" },
  ];
  const quickPlanSections = [
    "Setup",
    "Overview",
    "Schedule & Scope",
    "Budget",
    "Benefits",
    "Risk",
    "Issues",
    "Change Impact",
    "Related links",
    "Resource",
    "Dependency",
    "Miscellaneous",
    "Lessons learnt",
  ].map((label) => ({ label, active: label === "Overview" }));
  const sections = isQuickLinkPlan ? quickPlanSections : onboardingSections;
  const outcomes = ["Reduce fragmentation in research efforts"];
  const strategicObjectives = [
    { text: "Boost regional sustainability and growth through partnerships and investment", warning: false },
    { text: "Accelerate innovation to bring healthy products to the market that suits all needs and tastes", warning: true },
  ];
  const projectObjectives = [
    "To create a single source of truth for R&D in the UAE—connecting researchers, universities, government entities, industry partners, and funding bodies.",
  ];
  const capabilities = ["Regulatory Assurance", "Industry Analysis"];
  const services = [
    {
      group: "Corporate Services",
      valueStream: "Procure to Pay",
      phase: "Requisition",
      service: "Material Master Maintenance",
    },
  ];
  const completionRows = [
    ["Project basics", "Done", "done"],
    ["Overview", "In progress", "active"],
    ["Timeline", "Pending", "pending"],
    ["Budget", "Pending", "pending"],
    ["Risks", "Pending", "pending"],
    ["Issues", "Pending", "pending"],
    ["Change Impact", "Pending", "pending"],
    ["Related links", "Pending", "pending"],
    ["Resource", "Pending", "pending"],
    ["Dependancy", "Pending", "pending"],
  ];

  return `
    <section class="project-plan-page plan-builder-page ${isQuickLinkPlan ? "has-project-modebar" : ""}" aria-label="${escapeHtml(`${planProject} project plan`)}">
      ${ProjectScopeHero(
        planProject,
        isQuickLinkPlan ? { showModeTabs: true } : { planStatus: "Draft", planTone: "draft" }
      )}

      <div class="project-plan-shell plan-builder-shell ${isQuickLinkPlan ? "quick-plan-shell" : ""}">
        <aside class="project-plan-sections plan-builder-nav ${isQuickLinkPlan ? "quick-plan-nav" : ""}" aria-label="Project plan sections">
          ${sections
            .map((section) =>
              typeof section === "string"
                ? `<button type="button">${escapeHtml(section)}</button>`
                : section.type === "label"
                  ? `<span class="plan-builder-nav-label">${escapeHtml(section.label)}</span>`
                  : `<button class="${section.active ? "active" : ""}" type="button">${escapeHtml(section.label)}</button>`
            )
            .join("")}
        </aside>

        <main class="project-plan-content plan-builder-workspace ${isQuickLinkPlan ? "quick-plan-workspace" : ""}">
          ${isQuickLinkPlan ? ProjectPlanContentModeToggle() : ""}
          <div class="plan-builder-main ${isQuickLinkPlan ? "quick-plan-main" : ""}">
            ${
              isQuickLinkPlan
                ? ""
                : `<nav class="plan-builder-steps" aria-label="Project plan progress">
                    <span class="step-pill active">1 Setup</span>
                    <span class="step-line"></span>
                    <span class="step-pill">2 Plan</span>
                    <span class="step-line"></span>
                    <span class="step-pill">3 Review</span>
                  </nav>`
            }

            <section class="project-plan-form-card plan-builder-card plan-builder-overview-card">
              <div class="project-overview-head">
                <span>Overview</span>
                <h2>Project overview</h2>
                <p>Capture the case for change, intended outcomes, alignment, and linked business capabilities.</p>
              </div>

              <div class="overview-form-stack">
                <article class="overview-section">
                  <div class="overview-section-head">
                    <div>
                      <h3>Opportunity or Problem Statement ${icon("info")}</h3>
                      <p>Describe the need this project is addressing.</p>
                    </div>
                  </div>
                  <textarea readonly aria-label="Opportunity or Problem Statement">The UAE’s research ecosystem is fragmented and lacks a centralized, up-to-date platform to efficiently discover, connect, and leverage national R&amp;D capabilities.</textarea>
                </article>

                <article class="overview-section">
                  <div class="overview-section-head">
                    <div>
                      <h3>Business Drivers ${icon("info")}</h3>
                      <p>Link or add the business drivers informing the project.</p>
                    </div>
                    <button class="overview-add-button" type="button">${icon("plus")} Add Business Drivers</button>
                  </div>
                  <label class="overview-textarea-label">
                    <span>Driver for change / Analysis undertaken ${icon("info")}</span>
                    <textarea readonly aria-label="Driver for change / Analysis undertaken"></textarea>
                  </label>
                </article>

                <article class="overview-section">
                  <div class="overview-section-head">
                    <div>
                      <h3>Outcome ${icon("info")}</h3>
                      <p>Define the measurable outcome this project should deliver.</p>
                    </div>
                    <button class="overview-add-button" type="button">${icon("plus")} Add Outcome</button>
                  </div>
                  <div class="overview-table single-column" role="table" aria-label="Outcome">
                    <div class="overview-table-head" role="row">
                      <span>Outcome</span>
                      <span></span>
                    </div>
                    ${outcomes
                      .map(
                        (outcome) => `
                          <div class="overview-table-row" role="row">
                            <span>${escapeHtml(outcome)}</span>
                            <span class="overview-row-actions">
                              <button type="button" aria-label="Edit outcome">${icon("edit")}</button>
                              <button type="button" aria-label="Delete outcome">${icon("trash")}</button>
                            </span>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </article>

                <article class="overview-section">
                  <div class="overview-section-head">
                    <div>
                      <h3>Project Alignment ${icon("info")}</h3>
                      <p>Strategic objectives and project objectives linked to the plan.</p>
                    </div>
                  </div>
                  <div class="overview-table single-column" role="table" aria-label="Strategic Objectives">
                    <div class="overview-table-head" role="row">
                      <span>Strategic Objectives</span>
                      <span></span>
                    </div>
                    ${strategicObjectives
                      .map(
                        (objective) => `
                          <div class="overview-table-row ${objective.warning ? "warning" : ""}" role="row">
                            <span>${objective.warning ? icon("alert") : ""}${escapeHtml(objective.text)}</span>
                            <span class="overview-row-actions">
                              <button type="button" aria-label="Delete strategic objective">${icon("trash")}</button>
                            </span>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                  <div class="overview-table-caption">Showing 1 to 2 of 2 entries</div>
                  <button class="overview-add-button standalone" type="button">${icon("plus")} Add Project Objectives</button>
                  <div class="overview-table single-column" role="table" aria-label="Project Objective">
                    <div class="overview-table-head" role="row">
                      <span>Project Objective</span>
                      <span></span>
                    </div>
                    ${projectObjectives
                      .map(
                        (objective) => `
                          <div class="overview-table-row" role="row">
                            <span>${escapeHtml(objective)}</span>
                            <span class="overview-row-actions">
                              <button type="button" aria-label="Edit project objective">${icon("edit")}</button>
                              <button type="button" aria-label="Delete project objective">${icon("trash")}</button>
                            </span>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </article>

                <article class="overview-section">
                  <div class="overview-notice">There is no Business Plan Objective available as the project is not linked to any business plan.</div>
                  <div class="overview-notice">There is no Business Plan Output available as the project is not linked to any business plan.</div>
                </article>

                <article class="overview-section">
                  <div class="overview-section-head">
                    <div>
                      <h3>Capabilities</h3>
                      <p>Business capabilities connected to this project.</p>
                    </div>
                    <button class="overview-add-button" type="button">${icon("plus")} Link Capabilities</button>
                  </div>
                  <div class="overview-table single-column" role="table" aria-label="Capabilities">
                    <div class="overview-table-head" role="row">
                      <span>Capabilities</span>
                      <span></span>
                    </div>
                    ${capabilities
                      .map(
                        (capability) => `
                          <div class="overview-table-row" role="row">
                            <span>${escapeHtml(capability)}</span>
                            <span class="overview-row-actions">
                              <button type="button" aria-label="Delete capability">${icon("trash")}</button>
                            </span>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </article>

                <article class="overview-section">
                  <div class="overview-section-head">
                    <div>
                      <h3>Services</h3>
                      <p>Service mapping connected to the selected capabilities.</p>
                    </div>
                    <button class="overview-add-button" type="button">${icon("plus")} Link Services</button>
                  </div>
                  <div class="overview-table service-table" role="table" aria-label="Services">
                    <div class="overview-table-head" role="row">
                      <span>Service Group</span>
                      <span>Value Stream</span>
                      <span>Phase</span>
                      <span>Service</span>
                      <span></span>
                    </div>
                    ${services
                      .map(
                        (service) => `
                          <div class="overview-table-row" role="row">
                            <span>${escapeHtml(service.group)}</span>
                            <span>${escapeHtml(service.valueStream)}</span>
                            <span>${escapeHtml(service.phase)}</span>
                            <span>${escapeHtml(service.service)}</span>
                            <span class="overview-row-actions">
                              <button type="button" aria-label="Edit service">${icon("edit")}</button>
                              <button type="button" aria-label="Delete service">${icon("trash")}</button>
                            </span>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                </article>

                <article class="overview-section compact">
                  <div class="ai-component-row">
                    <div>
                      <h3>AI component<span>*</span> ${icon("info")}</h3>
                      <p>Identify whether the project includes an AI component.</p>
                    </div>
                    <div class="ai-radio-group" role="radiogroup" aria-label="AI component">
                      <label><input type="radio" name="aiComponent" /> Yes</label>
                      <label><input type="radio" name="aiComponent" checked /> No</label>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            ${
              isQuickLinkPlan
                ? ""
                : `<footer class="plan-builder-actions">
                    <button class="plan-builder-button secondary" type="button">Back</button>
                    <span></span>
                    <button class="plan-builder-button secondary" type="button">Save &amp; exit</button>
                    <button class="plan-builder-button primary" type="button">Continue</button>
                  </footer>`
            }
          </div>

          ${
            isQuickLinkPlan
              ? ""
              : `<aside class="plan-builder-support" aria-label="Project plan support">
                  <section class="plan-support-card completion-card">
                    <h3>Completion</h3>
                    <div class="completion-list">
                      ${completionRows
                        .map(
                          ([label, status, tone]) => `
                            <div class="completion-row">
                              <span>${escapeHtml(label)}</span>
                              <b class="${escapeHtml(tone)}">${escapeHtml(status)}</b>
                            </div>
                          `
                        )
                        .join("")}
                    </div>
                    <div class="completion-progress" aria-label="17% complete">
                      <span><i></i></span>
                      <small>17% - 1 of 6 sections done</small>
                    </div>
                  </section>

                  <section class="plan-support-card mode-card">
                    <h3>Mode</h3>
                    <strong>~18 min</strong>
                    <p>Simple - 6 sections</p>
                    <div class="mode-note">
                      <span>Detailed mode adds benefits, scope and dependencies — required for Tier 1 projects.</span>
                      ${icon("sparkles")}
                    </div>
                  </section>

                  <section class="plan-support-card">
                    <h3>PIF Playbook</h3>
                    <p>PIF Project Management Framework - Initiation stage guidance.</p>
                    <button type="button">View initiation checklist</button>
                  </section>

                  <section class="plan-support-card help-card">
                    <h3>Help</h3>
                    <button type="button">What fields are mandatory?</button>
                    <button type="button">Simple vs Detailed differences</button>
                    <button type="button">Contact your PMO admin</button>
                  </section>
                </aside>`
          }
        </main>
      </div>
    </section>
  `;
}

function PlaygroundPalette(state) {
  const addedTypes = new Set(state.nodes.map((node) => node.type));
  const availableTypes = playgroundRelationshipTypes.filter((type) => !addedTypes.has(type.id));
  const usedNodes = state.nodes;

  return `
    <aside class="playground-palette ${playgroundPaletteCollapsed ? "is-collapsed" : ""}" aria-label="Project relationship blocks">
      <button class="playground-palette-toggle" type="button" data-playground-palette-toggle aria-expanded="${!playgroundPaletteCollapsed}" aria-label="${playgroundPaletteCollapsed ? "Show blocks" : "Collapse blocks"}">
        ${icon(playgroundPaletteCollapsed ? "arrow" : "prev")}
        <span class="playground-palette-toggle-label">Blocks</span>
      </button>
      <div class="playground-palette-content">
        <div class="playground-palette-head">
          <span>Blocks</span>
          <p>Drag available blocks to the canvas. Used blocks can be hidden or shown.</p>
        </div>
        ${
          availableTypes.length
            ? `<section class="playground-block-section">
                <div class="playground-section-title">
                  <strong>Available</strong>
                  <span>${availableTypes.length}</span>
                </div>
                <div class="playground-palette-list">
                  ${availableTypes
                    .map(
                      (type) => `
                        <button
                          class="playground-palette-item ${type.tone}"
                          type="button"
                          draggable="true"
                          data-playground-type="${escapeHtml(type.id)}"
                          aria-label="${escapeHtml(`Add ${type.label}`)}"
                        >
                          <span>${icon(type.icon)}</span>
                          <strong>${escapeHtml(type.label)}</strong>
                          <small>${escapeHtml(type.hint)}</small>
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }
        <section class="playground-block-section used-section">
          <div class="playground-section-title">
            <strong>Used</strong>
            <span>${usedNodes.length}</span>
          </div>
          <div class="playground-palette-list used">
            ${
              usedNodes.length
                ? usedNodes
                    .map((node) => {
                      const type = playgroundType(node.type);
                      const hidden = Boolean(node.hidden);
                      return `
                        <article class="playground-used-item ${type.tone} ${hidden ? "is-hidden-block" : ""}">
                          <span>${icon(type.icon)}</span>
                          <div>
                            <strong>${escapeHtml(type.label)}</strong>
                            <small>${hidden ? "Hidden from canvas" : `${node.items.length} linked item${node.items.length === 1 ? "" : "s"}`}</small>
                          </div>
                          <button
                            type="button"
                            data-playground-visibility="${escapeHtml(node.id)}"
                            aria-label="${escapeHtml(`${hidden ? "Show" : "Hide"} ${type.label}`)}"
                          >
                            ${icon(hidden ? "eyeOff" : "eye")}
                          </button>
                        </article>
                      `;
                    })
                    .join("")
                : `<div class="playground-palette-empty compact">No used blocks yet.</div>`
            }
          </div>
        </section>
      </div>
    </aside>
  `;
}

function PlaygroundProjectNode(projectId, state) {
  const details = playgroundProjectDetails(projectId);
  const project = playgroundProjectId(projectId);

  return `
    <article
      class="playground-node playground-project-node"
      data-playground-node="project"
      data-playground-project-node
      style="left:${state.project.x}px; top:${state.project.y}px"
      aria-label="${escapeHtml(`${project} project hub`)}"
    >
      <img class="playground-project-art" src="./assets/project-card-line-art.svg" alt="" aria-hidden="true" />
      <div class="playground-project-copy">
        <span>Project hub</span>
        <h2>${escapeHtml(project)}</h2>
      </div>
      <dl class="playground-project-meta">
        <div><dt>Owner</dt><dd>${escapeHtml(details.owner)}</dd></div>
        <div><dt>Stage</dt><dd>${escapeHtml(details.stage)}</dd></div>
        <div><dt>Budget</dt><dd>${escapeHtml(details.budget)}</dd></div>
        <div><dt>Next gate</dt><dd>${escapeHtml(details.nextGate)}</dd></div>
      </dl>
    </article>
  `;
}

function PlaygroundRelationshipNode(node) {
  const type = playgroundType(node.type);
  const previewItems = node.items.slice(0, PLAYGROUND_PREVIEW_LIMIT);
  const hiddenCount = Math.max(node.items.length - previewItems.length, 0);
  return `
    <article
      class="playground-node playground-relationship-node ${type.tone}"
      data-playground-node="${escapeHtml(node.id)}"
      data-playground-tone="${escapeHtml(type.tone)}"
      style="left:${node.x}px; top:${node.y}px"
      aria-label="${escapeHtml(type.label)}"
    >
      <div class="playground-node-top">
        <span class="playground-node-icon ${type.tone}">${icon(type.icon)}</span>
        <button class="playground-node-grip" type="button" aria-label="Move ${escapeHtml(type.label)}">${icon("move")}</button>
      </div>
      <span class="playground-node-kicker">${escapeHtml(type.hint)}</span>
      <h3>${escapeHtml(type.label)}</h3>
      <ul class="playground-node-list">
        ${
          previewItems.length
            ? previewItems
                .map(
                  (item, index) => `
                    <li>
                      <button type="button" data-playground-item-detail="${escapeHtml(node.id)}" data-playground-item-index="${index}">
                        <span></span>${escapeHtml(playgroundItemTitle(item))}
                      </button>
                    </li>
                  `
                )
                .join("")
            : `<li class="empty"><span></span>No ${escapeHtml(type.label.toLowerCase())} added yet</li>`
        }
      </ul>
      <div class="playground-node-actions">
        ${
          hiddenCount
            ? `<button class="playground-view-more" type="button" data-playground-view-list="${escapeHtml(node.id)}">View ${hiddenCount} more</button>`
            : ""
        }
        <button class="playground-add-item" type="button" data-playground-add-item="${escapeHtml(node.id)}">
          ${icon("plus")}
          <span>Add ${escapeHtml(type.singular)}</span>
        </button>
      </div>
    </article>
  `;
}

function PlaygroundDrawer(selectedDrawer) {
  const context = playgroundDrawerContext(selectedDrawer);
  if (!context) return "";
  const { drawer, node, type, item } = context;
  const project = playgroundProjectId(selectedProject);
  const title =
    drawer.mode === "add"
      ? `Add ${type.singular}`
      : drawer.mode === "detail"
        ? playgroundItemTitle(item) || type.label
        : type.label;

  return `
    <div class="playground-drawer-shell" aria-live="polite">
      <button class="playground-drawer-backdrop" type="button" data-playground-drawer-close aria-label="Close playground drawer"></button>
      <aside class="playground-drawer" aria-label="${escapeHtml(`${title} drawer`)}">
        <div class="drawer-head">
          <button class="drawer-close" type="button" data-playground-drawer-close aria-label="Close drawer">${icon("prev")}</button>
          <div>
            <span class="eyebrow">${escapeHtml(project)}</span>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(type.label)} linked to this project.</p>
          </div>
        </div>
        ${
          drawer.mode === "add"
            ? PlaygroundAddDrawerContent(node, type)
            : drawer.mode === "detail"
              ? PlaygroundDetailDrawerContent(node, type, drawer.itemIndex)
              : PlaygroundListDrawerContent(node, type)
        }
      </aside>
    </div>
  `;
}

function PlaygroundListDrawerContent(node, type) {
  return `
    <div class="playground-drawer-section">
      <div class="playground-drawer-section-head">
        <span>${node.items.length} linked item${node.items.length === 1 ? "" : "s"}</span>
        <button type="button" data-playground-add-item="${escapeHtml(node.id)}">${icon("plus")} Add</button>
      </div>
      <div class="playground-full-list">
        ${
          node.items.length
            ? node.items
                .map(
                  (item, index) => `
                    <button type="button" data-playground-item-detail="${escapeHtml(node.id)}" data-playground-item-index="${index}">
                      <span class="playground-list-dot ${type.tone}"></span>
                      <strong>${escapeHtml(playgroundItemTitle(item))}</strong>
                      <small>${escapeHtml(playgroundItemStatus(index))}</small>
                    </button>
                  `
                )
                .join("")
            : `<div class="playground-empty-detail">No ${escapeHtml(type.label.toLowerCase())} have been added yet.</div>`
        }
      </div>
    </div>
  `;
}

function PlaygroundAddDrawerContent(node, type) {
  return `
    <form class="playground-add-form" data-playground-add-form>
      <label>
        <span>${escapeHtml(type.singular)} name</span>
        <input name="itemTitle" type="text" placeholder="Enter ${escapeHtml(type.singular)}" required />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="itemNote" rows="5" placeholder="Add context, owner, or next action"></textarea>
      </label>
      <button class="drawer-submit" type="submit">Add to ${escapeHtml(type.label)}</button>
    </form>
  `;
}

function PlaygroundDetailDrawerContent(node, type, itemIndex) {
  const item = node.items[itemIndex];
  if (!item) {
    return `<div class="playground-empty-detail">This item is no longer available.</div>`;
  }

  return `
    <div class="playground-detail-card ${type.tone}">
      <span>${icon(type.icon)}</span>
      <strong>${escapeHtml(playgroundItemTitle(item))}</strong>
      <p>${escapeHtml(playgroundItemNote(item) || `${type.hint} for ${playgroundProjectId(selectedProject)}.`)}</p>
    </div>
    <div class="playground-detail-grid">
      <div><span>Block</span><strong>${escapeHtml(type.label)}</strong></div>
      <div><span>Status</span><strong>${escapeHtml(playgroundItemStatus(itemIndex))}</strong></div>
      <div><span>Linked to</span><strong>${escapeHtml(playgroundProjectId(selectedProject))}</strong></div>
      <div><span>Owner</span><strong>${escapeHtml(playgroundProjectDetails(selectedProject).owner)}</strong></div>
    </div>
    <button class="playground-secondary-action" type="button" data-playground-view-list="${escapeHtml(node.id)}">
      View all ${escapeHtml(type.label.toLowerCase())}
    </button>
  `;
}

function ProjectPlayground(selectedProject) {
  const project = playgroundProjectId(selectedProject);
  const state = playgroundStateFor(project);
  const fullscreenLabel = playgroundFullscreen ? "Exit full screen" : "Expand playground";

  return `
    <section class="playground-page project-playground-page ${playgroundFullscreen ? "is-fullscreen" : ""}" aria-label="Project Playground">
      ${ProjectScopeHero(project)}
      ${ProjectModeTabs("playground")}
      <section class="playground-shell" aria-label="${escapeHtml(`${project} playground canvas`)}">
        ${PlaygroundPalette(state)}
        <section class="playground-stage">
          <div class="playground-surface" data-playground-canvas>
          <button class="playground-fullscreen-toggle" type="button" data-playground-fullscreen aria-label="${fullscreenLabel}" title="${fullscreenLabel}">
            ${icon(playgroundFullscreen ? "minimize" : "fullscreen")}
          </button>
          <div class="playground-zoom-controls" aria-label="Canvas zoom">
            <button type="button" data-playground-zoom="out" aria-label="Zoom out">${icon("minus")}</button>
            <span>${playgroundZoomLabel()}</span>
            <button type="button" data-playground-zoom="in" aria-label="Zoom in">${icon("plus")}</button>
            <button type="button" data-playground-zoom="reset">Reset</button>
          </div>
          <div class="playground-viewport" data-playground-viewport style="${playgroundViewStyle()}">
            <svg class="playground-links" data-playground-links aria-hidden="true"></svg>
            ${PlaygroundProjectNode(project, state)}
            ${state.nodes.filter((node) => !node.hidden).map(PlaygroundRelationshipNode).join("")}
          </div>
        </div>
      </section>
      </section>
    </section>
  `;
}

function OnboardingSequence() {
  const onboardingSteps = [
    {
      title: "Plan",
      body: "Create project plans, timelines, risks, and dependencies.",
      icon: "./assets/onboarding-step-plan.svg",
    },
    {
      title: "Report",
      body: "Submit weekly PSRs, update status, and track delivery health.",
      icon: "./assets/onboarding-step-report.svg",
    },
    {
      title: "Govern",
      body: "Monitor actions, approvals, and project workflows.",
      icon: "./assets/onboarding-step-govern.svg",
    },
  ];

  return `
    <section class="onboarding-screen" aria-label="Tasama onboarding">
      <img class="onboarding-line-art" src="./assets/onboarding-figma-line-art.svg" alt="" aria-hidden="true" />
      <div class="onboarding-brand" aria-label="Tasama">
        <img src="./assets/tasama-onboarding-logo.svg" alt="Tasama" />
      </div>
      <div class="onboarding-intro">
        <h1><span>Welcome,</span><em>Ahmed Khalid</em></h1>
        <p>Manage projects, delivery &amp; reporting, in one intelligent operational workspace.</p>
        <div class="onboarding-actions">
          <button class="onboarding-primary" type="button" data-onboarding-finish="tour">
            <span>Take A Tour</span>
            <span class="onboarding-primary-icon">${icon("arrow")}</span>
          </button>
          <button class="onboarding-secondary" type="button" data-onboarding-finish="project">
            <span>Proceed to front door</span>
            ${icon("compass")}
          </button>
        </div>
      </div>
      <aside class="onboarding-options" aria-label="PMO onboarding options">
        <div class="onboarding-options-list">
          <header>
            <span>Getting started</span>
            <strong>Your PMO onboarding</strong>
            <small>A quick walkthrough — 2 minutes.</small>
          </header>
          ${onboardingSteps
            .map(
              ({ title, body, icon: stepIcon }, index) => `
                <article>
                  <img src="${stepIcon}" alt="" aria-hidden="true" />
                  <div>
                    <strong>${escapeHtml(title)}</strong>
                    <p>${escapeHtml(body)}</p>
                  </div>
                  <span>${index + 1}</span>
                </article>
              `
            )
            .join("")}
        </div>
      </aside>
      <div class="onboarding-powered">
        <span>Powered by</span>
        <img src="./assets/strategy-zero-logo.png" alt="Strategy Zero" />
      </div>
    </section>
  `;
}

function LoginPage() {
  return `
    <section class="login-screen" aria-label="Tasama sign in">
      <div class="login-column">
        <div class="login-stack">
          <div class="login-form-wrap">
            <button class="login-logo-button" type="button" data-onboarding-start aria-label="Start Tasama onboarding">
              <img class="login-logo" src="./assets/login-logo.png" alt="Tasama" />
            </button>
            <form class="login-form" data-login-form>
              <div class="login-copy">
                <h1>Sign Into Your Account</h1>
                <p>Please type in your username and password to sign in</p>
              </div>
              <label class="login-field">
                <span>Username</span>
                <input type="text" autocomplete="username" placeholder="Enter your username" />
              </label>
              <label class="login-field">
                <span>Password</span>
                <input type="password" autocomplete="current-password" placeholder="Enter password" />
              </label>
              <div class="login-options">
                <label class="login-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button class="login-link" type="button">Forgot Password?</button>
              </div>
              <button class="login-submit" type="submit">Sign In</button>
              <p class="login-learn">Don’t have an Account? <button type="button">Learn More</button></p>
            </form>
          </div>
          <div class="login-powered">
            <span>Powered by</span>
            <img src="./assets/strategy-zero-logo.png" alt="Strategy Zero" />
          </div>
        </div>
      </div>
      <aside class="login-hero" aria-label="AI-Powered Strategy Execution">
        <div class="login-hero-carousel" aria-hidden="true">
          <img class="login-hero-slide" src="./assets/login-hero.jpg" alt="" />
          <img class="login-hero-slide" src="./assets/login-saudi-riyadh.jpg" alt="" />
          <img class="login-hero-slide" src="./assets/login-saudi-hegra.jpg" alt="" />
          <img class="login-hero-slide" src="./assets/login-saudi-alula.jpg" alt="" />
        </div>
        <div class="login-hero-shade"></div>
        <div class="login-hero-copy">
          <h2>AI-Powered Strategy Execution</h2>
          <p>Transform vision into action with intelligent automation, ensuring seamless execution and measurable results.</p>
          <div class="login-dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
      </aside>
    </section>
  `;
}

function App(
  selectedProject = "all",
  selectedView = "calendar",
  selectedRange = "year",
  selectedBoardFilter = "all",
  selectedCalendarMonth = monthStart(new Date()),
  selectedGate = null,
  selectedReportProject = null,
  selectedPage = "workspace",
  selectedPlaygroundDrawer = null,
  frontDoorMode = "assigned"
) {
  const isPlayground = selectedPage === "playground";
  const isWbs = selectedPage === "wbs";
  const isProjectPlan = selectedPage === "project-plan";
  const isWorkspaces = selectedPage === "workspaces";
  const isUnassigned = frontDoorMode === "unassigned";
  return `
    <div class="modern-shell ${isPlayground ? "playground-mode" : ""} ${isWbs ? "wbs-mode" : ""} ${isProjectPlan ? "project-plan-mode" : ""} ${isUnassigned ? "unassigned-mode" : ""}">
      ${AppHeader(selectedProject, notificationPanelOpen, selectedPage, frontDoorMode)}
      ${Sidebar(selectedPage, frontDoorMode)}
      <main class="app-canvas ${isPlayground ? "playground-canvas" : ""} ${isWbs ? "wbs-canvas" : ""} ${isProjectPlan ? "project-plan-canvas" : ""} ${isWorkspaces ? "workspaces-canvas" : ""} ${isUnassigned ? "unassigned-canvas" : ""}">
        ${
          isUnassigned
            ? UnassignedFrontDoor()
            : isPlayground
            ? ProjectPlayground(selectedProject)
            : isWbs
              ? WbsGanttPage(selectedProject)
              : isProjectPlan
                ? ProjectPlanPage(selectedProject, projectPlanEntryPoint)
                : isWorkspaces
                  ? WorkspacesPage()
                : `<div class="content-grid">
                <div class="left-column">
                  ${WorkspacePanel(selectedProject, selectedView, selectedRange, selectedBoardFilter, selectedCalendarMonth)}
                </div>
                <div class="right-column ${isAllProjects(selectedProject) ? "portfolio-frontdoor" : "project-frontdoor"}">
                  ${RightRail(selectedProject)}
                </div>
              </div>`
        }
      </main>
    </div>
    ${StageGateDrawer(selectedGate)}
    ${ReportComposerDrawer(selectedReportProject)}
    ${PlaygroundDrawer(selectedPlaygroundDrawer)}
    ${NotificationPanel(notificationPanelOpen)}
    ${GuidedTourOverlay()}
  `;
}

let selectedProject = "all";
let selectedPage = "workspace";
let selectedView = "calendar";
let selectedTimelineRange = "year";
let selectedBoardFilter = "all";
let selectedCalendarMonth = monthStart(new Date());
let selectedAiInsightIndex = 0;
let selectedWbsSearch = "";
let selectedWbsViewBy = "months";
let selectedWbsZoom = 1;
let selectedStageGate = null;
let selectedReportProject = null;
let selectedPlaygroundDrawer = null;
let projectPlanDetailMode = "simple";
let projectPlanActiveSection = "Overview";
let projectPlanSectionsExpanded = false;
let projectPlanExpandedFieldSections = {};
let notificationPanelOpen = false;
let guidedTourActive = false;
let guidedTourStep = 0;
let guidedTourExitMode = null;
let frontDoorMode = "assigned";
let pmoAssignmentReady = false;
let projectPlanEntryPoint = "quick";
let isAuthenticated = false;
let onboardingActive = false;
let aiInsightTimer = null;
const stageAdvancements = {};
const reportDrafts = {};
const playgroundCanvasStates = {};
let playgroundPaletteCollapsed = false;
let playgroundFullscreen = false;
let playgroundZoom = 1;
const playgroundPan = { x: -780, y: -390 };
let activePlaygroundDrag = null;
let activePlaygroundPan = null;

function renderApp() {
  clearAiInsightsTimer();
  document.querySelector(".calendar-detail-popover")?.classList.remove("is-visible");
  document.querySelector(".report-trend-popover")?.classList.remove("is-visible");
  if (onboardingActive) {
    document.getElementById("app").innerHTML = OnboardingSequence();
    initLucideIcons();
    initOnboardingPage();
    return;
  }
  if (!isAuthenticated) {
    document.getElementById("app").innerHTML = LoginPage();
    initLucideIcons();
    initLoginPage();
    return;
  }
  document.getElementById("app").innerHTML = App(
    selectedProject,
    selectedView,
    selectedTimelineRange,
    selectedBoardFilter,
    selectedCalendarMonth,
    selectedStageGate,
    selectedReportProject,
    selectedPage,
    selectedPlaygroundDrawer,
    frontDoorMode
  );
  initLucideIcons();
  initPageNavigation();
  initProjectSwitch();
  initWorkspaceSwitch();
  initAiInsightsWidget();
  initBoardFilter();
  initCalendarNavigation();
  initCalendarEventPopovers();
  initReportTrendPopovers();
  initProjectPlanMatrix();
  initProjectPlayground();
  initPlaygroundDrawer();
  initWbsGantt();
  initStageGateDrawer();
  initReportDrawer();
  initNotificationPanel();
  initPmoAssignmentPreview();
  initGuidedTour();
}

function clearAiInsightsTimer() {
  if (!aiInsightTimer) return;
  window.clearInterval(aiInsightTimer);
  aiInsightTimer = null;
}

function enterFrontDoor(projectId = "all", startTour = false, mode = "assigned", postTourMode = null) {
  isAuthenticated = true;
  onboardingActive = false;
  frontDoorMode = mode;
  pmoAssignmentReady = false;
  selectedPage = "workspace";
  projectPlanEntryPoint = "quick";
  selectedProject = projectId;
  selectedView = "calendar";
  selectedBoardFilter = "all";
  selectedStageGate = null;
  selectedReportProject = null;
  selectedPlaygroundDrawer = null;
  projectPlanDetailMode = "simple";
  projectPlanActiveSection = "Overview";
  projectPlanSectionsExpanded = false;
  projectPlanExpandedFieldSections = {};
  notificationPanelOpen = false;
  guidedTourActive = startTour;
  guidedTourStep = 0;
  guidedTourExitMode = postTourMode;
  renderApp();
}

function initLoginPage() {
  document.querySelector("[data-onboarding-start]")?.addEventListener("click", () => {
    onboardingActive = true;
    renderApp();
  });

  const form = document.querySelector("[data-login-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    enterFrontDoor("all");
  });
}

function initOnboardingPage() {
  document.querySelectorAll("[data-onboarding-finish]").forEach((button) => {
    button.addEventListener("click", () => {
      const startsTour = button.dataset.onboardingFinish === "tour";
      enterFrontDoor(startsTour ? "all" : "Vision 2030", startsTour, "assigned", startsTour ? "unassigned" : null);
    });
  });
}

function completeGuidedTour() {
  guidedTourActive = false;
  guidedTourStep = 0;
  if (guidedTourExitMode === "unassigned") {
    frontDoorMode = "unassigned";
    pmoAssignmentReady = false;
    selectedPage = "workspace";
    projectPlanEntryPoint = "quick";
    selectedProject = "all";
    selectedView = "calendar";
    selectedBoardFilter = "all";
    selectedStageGate = null;
    selectedReportProject = null;
    selectedPlaygroundDrawer = null;
    projectPlanDetailMode = "simple";
    projectPlanActiveSection = "Overview";
    projectPlanSectionsExpanded = false;
    projectPlanExpandedFieldSections = {};
    notificationPanelOpen = false;
  }
  guidedTourExitMode = null;
  renderApp();
}

function positionGuidedTour() {
  const overlay = document.querySelector("[data-tour-overlay]");
  if (!overlay) return;
  const targetName = overlay.dataset.tourTargetName;
  let target = document.querySelector(`[data-tour-target="${targetName}"]`) || document.querySelector(".app-canvas");
  if (!target) return;

  let rect = target.getBoundingClientRect();
  if (rect.width < 4 || rect.height < 4) {
    target = document.querySelector(".app-canvas") || target;
    rect = target.getBoundingClientRect();
  }

  const spotlight = overlay.querySelector("[data-tour-spotlight]");
  const card = overlay.querySelector("[data-tour-card]");
  if (!spotlight || !card) return;

  const padding = 8;
  const isRailTour = targetName === "side-navigation";
  const railWidth = Math.min(rect.width, 68);
  const x = isRailTour
    ? Math.max(8, rect.left + Math.max(0, (rect.width - railWidth) / 2) - padding)
    : Math.max(8, rect.left - padding);
  const y = isRailTour ? Math.max(8, rect.top + 8) : Math.max(8, rect.top - padding);
  const width = isRailTour ? Math.min(window.innerWidth - x - 8, railWidth + padding * 2) : Math.min(window.innerWidth - x - 8, rect.width + padding * 2);
  const height = isRailTour ? Math.min(window.innerHeight - y - 8, rect.height - 16) : Math.min(window.innerHeight - y - 8, rect.height + padding * 2);
  spotlight.style.left = `${Math.round(x)}px`;
  spotlight.style.top = `${Math.round(y)}px`;
  spotlight.style.width = `${Math.round(width)}px`;
  spotlight.style.height = `${Math.round(height)}px`;

  const cardWidth = card.offsetWidth || 330;
  const cardHeight = card.offsetHeight || 270;
  let cardX = isRailTour ? x + width + 24 : rect.right + 18;
  if (cardX + cardWidth > window.innerWidth - 18) {
    cardX = rect.left - cardWidth - 18;
  }
  if (cardX < 18) {
    cardX = Math.max(18, Math.min(window.innerWidth - cardWidth - 18, rect.left + rect.width / 2 - cardWidth / 2));
  }
  const cardY = isRailTour
    ? Math.max(96, Math.min(window.innerHeight - cardHeight - 18, rect.top + 24))
    : Math.max(84, Math.min(window.innerHeight - cardHeight - 18, rect.top));
  card.style.left = `${Math.round(cardX)}px`;
  card.style.top = `${Math.round(cardY)}px`;
}

function initGuidedTour() {
  if (!guidedTourActive) return;
  requestAnimationFrame(positionGuidedTour);

  document.querySelectorAll("[data-tour-end]").forEach((button) => {
    button.addEventListener("click", () => {
      completeGuidedTour();
    });
  });

  document.querySelector("[data-tour-next]")?.addEventListener("click", () => {
    if (guidedTourStep >= guidedTourSteps.length - 1) {
      completeGuidedTour();
      return;
    } else {
      guidedTourStep += 1;
    }
    renderApp();
  });

  document.querySelector("[data-tour-prev]")?.addEventListener("click", () => {
    guidedTourStep = Math.max(0, guidedTourStep - 1);
    renderApp();
  });
}

function initPmoAssignmentPreview() {
  document.querySelector("[data-pmo-assignment-trigger]")?.addEventListener("click", () => {
    pmoAssignmentReady = true;
    selectedProject = firstAssignedProject.id;
    selectedPage = "workspace";
    selectedStageGate = null;
    selectedReportProject = null;
    selectedPlaygroundDrawer = null;
    notificationPanelOpen = false;
    renderApp();
  });
}

function initProjectPlanMatrix() {
  document.querySelectorAll("[data-plan-detail-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.planDetailMode;
      if (!mode || mode === projectPlanDetailMode) return;
      projectPlanDetailMode = mode;
      if (mode === "detailed") {
        projectPlanActiveSection = "Overview";
      }
      renderApp();
    });
  });

  document.querySelectorAll("[data-plan-section]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.planSection;
      if (!section) return;
      projectPlanActiveSection = section;
      projectPlanDetailMode = "detailed";
      renderApp();
    });
  });

  document.querySelector("[data-plan-show-more-sections]")?.addEventListener("click", () => {
    projectPlanSectionsExpanded = !projectPlanSectionsExpanded;
    if (!projectPlanSectionsExpanded && projectPlanDetailedOnlySections.includes(projectPlanActiveSection)) {
      projectPlanActiveSection = "Overview";
    }
    renderApp();
  });

  document.querySelectorAll("[data-plan-show-more-fields]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.planShowMoreFields;
      if (!section) return;
      projectPlanExpandedFieldSections = {
        ...projectPlanExpandedFieldSections,
        [section]: !projectPlanExpandedFieldSections[section],
      };
      renderApp();
    });
  });
}

function initPageNavigation() {
  document.querySelectorAll("[data-page-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetPage = button.dataset.pageTarget;
      if (button.dataset.projectId) {
        selectedProject = button.dataset.projectId;
      }
      if (targetPage === "project-plan") {
        projectPlanEntryPoint = button.dataset.planEntry || (button.closest(".quick-action-list") ? "quick" : "onboarding");
        projectPlanDetailMode = "simple";
        projectPlanActiveSection = "Overview";
        projectPlanSectionsExpanded = false;
        projectPlanExpandedFieldSections = {};
      }
      if (frontDoorMode === "unassigned" && targetPage !== "workspace") {
        if (pmoAssignmentReady && targetPage === "project-plan") {
          frontDoorMode = "assigned";
          selectedProject = firstAssignedProject.id;
          selectedPage = "project-plan";
          projectPlanEntryPoint = "onboarding";
        } else {
          selectedPage = "workspace";
          return;
        }
      } else {
        selectedPage = targetPage;
      }
      if (!pmoAssignmentReady && selectedPage === "project-plan" && frontDoorMode === "unassigned") {
        selectedPage = "workspace";
        return;
      }
      if (selectedPage === "playground" && isAllProjects(selectedProject)) {
        selectedProject = "Vision 2030";
      }
      if (selectedPage === "wbs" && isAllProjects(selectedProject)) {
        selectedProject = "Vision 2030";
      }
      if (selectedPage === "project-plan" && isAllProjects(selectedProject)) {
        selectedProject = "Vision 2030";
      }
      if (selectedPage !== "playground") {
        playgroundFullscreen = false;
      }
      selectedStageGate = null;
      selectedReportProject = null;
      selectedPlaygroundDrawer = null;
      notificationPanelOpen = false;
      renderApp();
    });
  });
}

function initProjectSwitch() {
  const selects = document.querySelectorAll("[data-project-select]");
  selects.forEach((select) => {
    select.addEventListener("change", (event) => {
      selectedProject = event.target.value;
      selectedStageGate = null;
      selectedReportProject = null;
      selectedPlaygroundDrawer = null;
      playgroundFullscreen = false;
      renderApp();
    });
  });
}

function initWorkspaceSwitch() {
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedView = button.dataset.viewTarget;
      selectedStageGate = null;
      selectedReportProject = null;
      selectedPlaygroundDrawer = null;
      renderApp();
    });
  });
}

function initBoardFilter() {
  document.querySelectorAll("[data-work-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedBoardFilter = button.dataset.workFilter;
      renderApp();
    });
  });
}

function initAiInsightsWidget() {
  const widget = document.querySelector(".ai-insight-widget");
  document.querySelectorAll("[data-ai-insight-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number.parseInt(button.dataset.aiInsightNav, 10) || 1;
      selectedAiInsightIndex = (selectedAiInsightIndex + direction + aiWorkspaceInsights.length) % aiWorkspaceInsights.length;
      renderApp();
    });
  });

  document.querySelectorAll("[data-ai-insight-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAiInsightIndex = Number.parseInt(button.dataset.aiInsightIndex, 10) || 0;
      renderApp();
    });
  });

  if (!widget || aiWorkspaceInsights.length < 2) return;

  aiInsightTimer = window.setInterval(() => {
    if (!document.querySelector(".ai-insight-widget") || document.hidden) return;
    selectedAiInsightIndex = (selectedAiInsightIndex + 1) % aiWorkspaceInsights.length;
    renderApp();
  }, 4200);
}

function initTimelineRangeSwitch() {
  document.querySelectorAll("[data-timeline-range]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTimelineRange = button.dataset.timelineRange;
      selectedView = "timeline";
      renderApp();
    });
  });
}

function initCalendarNavigation() {
  document.querySelectorAll("[data-calendar-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.calendarNav;
      selectedCalendarMonth = direction === "today" ? monthStart(new Date()) : addMonths(selectedCalendarMonth, Number(direction));
      selectedView = "calendar";
      renderApp();
    });
  });
}

function calendarPopover() {
  let popover = document.querySelector(".calendar-detail-popover");
  if (!popover) {
    popover = document.createElement("div");
    popover.className = "calendar-detail-popover";
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-hidden", "true");
    document.body.appendChild(popover);
  }
  return popover;
}

function showCalendarPopover(trigger) {
  const popover = calendarPopover();
  popover.innerHTML = `
    <strong>${escapeHtml(trigger.dataset.title)}</strong>
    <p>${escapeHtml(trigger.dataset.project)}</p>
    <div class="calendar-detail-meta">
      <span>Type <b>${escapeHtml(trigger.dataset.kind)}</b></span>
      <span>Date <b>${escapeHtml(trigger.dataset.date)}</b></span>
      <span>Status <b>${escapeHtml(trigger.dataset.status)}</b></span>
    </div>
  `;
  popover.classList.add("is-visible");
  popover.classList.remove("is-below");
  popover.setAttribute("aria-hidden", "false");

  const rect = trigger.getBoundingClientRect();
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const left = Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12);
  let top = rect.top - height - 10;

  if (top < 12) {
    top = rect.bottom + 10;
    popover.classList.add("is-below");
  }

  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

function hideCalendarPopover() {
  const popover = document.querySelector(".calendar-detail-popover");
  if (!popover) return;
  popover.classList.remove("is-visible", "is-below");
  popover.setAttribute("aria-hidden", "true");
}

function reportTrendPopover() {
  let popover = document.querySelector(".report-trend-popover");
  if (!popover) {
    popover = document.createElement("div");
    popover.className = "report-trend-popover";
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-hidden", "true");
    document.body.appendChild(popover);
  }
  return popover;
}

function showReportTrendPopover(trigger) {
  const popover = reportTrendPopover();
  popover.innerHTML = `
    <div class="report-popover-head">
      <strong>${escapeHtml(trigger.dataset.reportProject)}</strong>
      <span>${escapeHtml(trigger.dataset.reportStatus)}</span>
    </div>
    <p>${escapeHtml(trigger.dataset.reportInterval)} reporting interval</p>
    <div class="report-popover-meta">
      <span>${escapeHtml(trigger.dataset.reportDetail)}</span>
      <span>${escapeHtml(trigger.dataset.reportCadence)} cadence</span>
      <span>Next due ${escapeHtml(trigger.dataset.reportNext)}</span>
    </div>
  `;
  popover.classList.add("is-visible");
  popover.classList.remove("is-below");
  popover.setAttribute("aria-hidden", "false");

  const rect = trigger.getBoundingClientRect();
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const left = Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12);
  let top = rect.top - height - 10;

  if (top < 12) {
    top = rect.bottom + 10;
    popover.classList.add("is-below");
  }

  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

function hideReportTrendPopover() {
  const popover = document.querySelector(".report-trend-popover");
  if (!popover) return;
  popover.classList.remove("is-visible", "is-below");
  popover.setAttribute("aria-hidden", "true");
}

function initCalendarEventPopovers() {
  document.querySelectorAll(".calendar-event").forEach((item) => {
    item.addEventListener("mouseenter", () => showCalendarPopover(item));
    item.addEventListener("focus", () => showCalendarPopover(item));
    item.addEventListener("mouseleave", hideCalendarPopover);
    item.addEventListener("blur", hideCalendarPopover);
  });
}

function initReportTrendPopovers() {
  document.querySelectorAll("[data-report-point]").forEach((item) => {
    item.addEventListener("mouseenter", () => showReportTrendPopover(item));
    item.addEventListener("focus", () => showReportTrendPopover(item));
    item.addEventListener("mouseleave", hideReportTrendPopover);
    item.addEventListener("blur", hideReportTrendPopover);
  });
}

function addPlaygroundNode(typeId, x = null, y = null) {
  const project = playgroundProjectId(selectedProject);
  const state = playgroundStateFor(project);
  if (state.nodes.some((node) => node.type === typeId)) return;

  const index = state.nodes.length;
  state.nodes.push({
    id: typeId,
    type: typeId,
    x: x ?? 820 + (index % 4) * 260,
    y: y ?? 750 + Math.floor(index / 4) * 210,
    hidden: false,
    items: [],
  });
  renderApp();
}

function playgroundPanBounds(surface, viewport, zoom = playgroundZoom) {
  const padding = 120;
  const scaledWidth = viewport.offsetWidth * zoom;
  const scaledHeight = viewport.offsetHeight * zoom;
  const horizontalCenter = (surface.clientWidth - scaledWidth) / 2;
  const verticalCenter = (surface.clientHeight - scaledHeight) / 2;
  const minX = scaledWidth <= surface.clientWidth ? horizontalCenter : surface.clientWidth - scaledWidth - padding;
  const maxX = scaledWidth <= surface.clientWidth ? horizontalCenter : padding;
  const minY = scaledHeight <= surface.clientHeight ? verticalCenter : surface.clientHeight - scaledHeight - padding;
  const maxY = scaledHeight <= surface.clientHeight ? verticalCenter : padding;
  return { minX, maxX, minY, maxY };
}

function clampPlaygroundPan(surface, viewport, nextPan = playgroundPan, zoom = playgroundZoom) {
  const bounds = playgroundPanBounds(surface, viewport, zoom);
  return {
    x: Math.min(Math.max(nextPan.x, bounds.minX), bounds.maxX),
    y: Math.min(Math.max(nextPan.y, bounds.minY), bounds.maxY),
  };
}

function applyPlaygroundPan() {
  const viewport = document.querySelector("[data-playground-viewport]");
  if (!viewport) return;
  viewport.style.setProperty("--playground-pan-x", `${Math.round(playgroundPan.x)}px`);
  viewport.style.setProperty("--playground-pan-y", `${Math.round(playgroundPan.y)}px`);
}

function setPlaygroundPan(nextPan) {
  const surface = document.querySelector("[data-playground-canvas]");
  const viewport = document.querySelector("[data-playground-viewport]");
  if (!surface || !viewport) return;
  const clamped = clampPlaygroundPan(surface, viewport, nextPan);
  playgroundPan.x = clamped.x;
  playgroundPan.y = clamped.y;
  applyPlaygroundPan();
}

function setPlaygroundZoom(action, focalPoint = null) {
  const surface = document.querySelector("[data-playground-canvas]");
  const viewport = document.querySelector("[data-playground-viewport]");
  const previousZoom = playgroundZoom;

  if (action === "reset") {
    playgroundZoom = 1;
    playgroundPan.x = 0;
    playgroundPan.y = 0;
  } else {
    const nextZoom = typeof action === "number" ? action : playgroundZoom + (action === "in" ? 0.1 : -0.1);
    playgroundZoom = Math.min(1.8, Math.max(0.35, Number(nextZoom.toFixed(2))));
  }

  if (surface && viewport && action !== "reset") {
    const surfaceRect = surface.getBoundingClientRect();
    const focus = focalPoint || {
      clientX: surfaceRect.left + surfaceRect.width / 2,
      clientY: surfaceRect.top + surfaceRect.height / 2,
    };
    const focalX = focus.clientX - surfaceRect.left;
    const focalY = focus.clientY - surfaceRect.top;
    const worldX = (focalX - playgroundPan.x) / previousZoom;
    const worldY = (focalY - playgroundPan.y) / previousZoom;
    const nextPan = {
      x: focalX - worldX * playgroundZoom,
      y: focalY - worldY * playgroundZoom,
    };
    const clamped = clampPlaygroundPan(surface, viewport, nextPan, playgroundZoom);
    playgroundPan.x = clamped.x;
    playgroundPan.y = clamped.y;
  }

  renderApp();
}

function drawPlaygroundConnectors() {
  const viewport = document.querySelector("[data-playground-viewport]");
  const svg = document.querySelector("[data-playground-links]");
  const projectNode = document.querySelector("[data-playground-project-node]");
  if (!viewport || !svg || !projectNode) return;

  svg.setAttribute("viewBox", `0 0 ${viewport.offsetWidth} ${viewport.offsetHeight}`);
  const projectRect = {
    left: Number.parseFloat(projectNode.style.left) || 0,
    top: Number.parseFloat(projectNode.style.top) || 0,
    width: projectNode.offsetWidth,
    height: projectNode.offsetHeight,
  };
  const projectCenter = {
    x: projectRect.left + projectRect.width / 2,
    y: projectRect.top + projectRect.height / 2,
  };

  const marker = `
    <defs>
      <marker id="playground-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z"></path>
      </marker>
    </defs>
  `;

  const paths = Array.from(document.querySelectorAll(".playground-relationship-node"))
    .map((node) => {
      const rect = {
        left: Number.parseFloat(node.style.left) || 0,
        top: Number.parseFloat(node.style.top) || 0,
        width: node.offsetWidth,
        height: node.offsetHeight,
      };
      const nodeCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const movingRight = nodeCenter.x >= projectCenter.x;
      const start = {
        x: projectCenter.x + (movingRight ? projectRect.width / 2 : -projectRect.width / 2),
        y: projectCenter.y,
      };
      const end = {
        x: nodeCenter.x + (movingRight ? -rect.width / 2 : rect.width / 2),
        y: nodeCenter.y,
      };
      const curve = Math.max(90, Math.abs(end.x - start.x) * 0.42);
      const c1x = start.x + (movingRight ? curve : -curve);
      const c2x = end.x - (movingRight ? curve : -curve);
      return `<path class="playground-link ${node.dataset.playgroundTone || "neutral"}" d="M ${start.x} ${start.y} C ${c1x} ${start.y}, ${c2x} ${end.y}, ${end.x} ${end.y}" marker-end="url(#playground-arrow)" />`;
    })
    .join("");

  svg.innerHTML = `${marker}${paths}`;
}

function movePlaygroundNode(event) {
  if (!activePlaygroundDrag) return;
  const { viewport, nodeElement, nodeState, offsetX, offsetY, zoom } = activePlaygroundDrag;
  const rect = viewport.getBoundingClientRect();
  const maxX = Math.max(16, viewport.offsetWidth - nodeElement.offsetWidth - 16);
  const maxY = Math.max(16, viewport.offsetHeight - nodeElement.offsetHeight - 16);
  const pointerX = (event.clientX - rect.left) / zoom;
  const pointerY = (event.clientY - rect.top) / zoom;
  const nextX = Math.min(Math.max(16, pointerX - offsetX), maxX);
  const nextY = Math.min(Math.max(16, pointerY - offsetY), maxY);

  nodeState.x = Math.round(nextX);
  nodeState.y = Math.round(nextY);
  nodeElement.style.left = `${nodeState.x}px`;
  nodeElement.style.top = `${nodeState.y}px`;
  drawPlaygroundConnectors();
}

function stopPlaygroundNodeDrag() {
  document.removeEventListener("pointermove", movePlaygroundNode);
  activePlaygroundDrag = null;
}

function movePlaygroundCanvas(event) {
  if (!activePlaygroundPan) return;
  setPlaygroundPan({
    x: activePlaygroundPan.startPanX + event.clientX - activePlaygroundPan.startX,
    y: activePlaygroundPan.startPanY + event.clientY - activePlaygroundPan.startY,
  });
}

function stopPlaygroundCanvasPan() {
  document.removeEventListener("pointermove", movePlaygroundCanvas);
  const canvas = document.querySelector("[data-playground-canvas]");
  canvas?.classList.remove("is-panning");
  activePlaygroundPan = null;
}

function startPlaygroundCanvasPan(event) {
  if (event.button !== 0) return;
  if (event.target.closest(".playground-node, .playground-palette, .playground-toolbar, .playground-zoom-controls, button, input, textarea, select, a")) return;
  event.preventDefault();

  const canvas = document.querySelector("[data-playground-canvas]");
  if (!canvas) return;

  activePlaygroundPan = {
    startX: event.clientX,
    startY: event.clientY,
    startPanX: playgroundPan.x,
    startPanY: playgroundPan.y,
  };

  canvas.classList.add("is-panning");
  document.addEventListener("pointermove", movePlaygroundCanvas);
  document.addEventListener("pointerup", stopPlaygroundCanvasPan, { once: true });
}

function startPlaygroundNodeDrag(event) {
  if (event.button !== 0 || event.target.closest("button, input, textarea, select, a")) return;
  event.preventDefault();
  event.stopPropagation();

  const viewport = document.querySelector("[data-playground-viewport]");
  if (!viewport) return;

  const nodeElement = event.currentTarget;
  const state = playgroundStateFor(playgroundProjectId(selectedProject));
  const nodeState = playgroundNodeFor(state, nodeElement.dataset.playgroundNode);
  if (!nodeState) return;

  const rect = nodeElement.getBoundingClientRect();
  const zoom = playgroundZoom;
  activePlaygroundDrag = {
    viewport,
    nodeElement,
    nodeState,
    zoom,
    offsetX: (event.clientX - rect.left) / zoom,
    offsetY: (event.clientY - rect.top) / zoom,
  };

  nodeElement.setPointerCapture?.(event.pointerId);
  document.addEventListener("pointermove", movePlaygroundNode);
  document.addEventListener("pointerup", stopPlaygroundNodeDrag, { once: true });
}

function initProjectPlayground() {
  const canvas = document.querySelector("[data-playground-canvas]");
  const viewport = document.querySelector("[data-playground-viewport]");
  if (!canvas) return;

  document.querySelectorAll("[data-playground-fullscreen]").forEach((button) => {
    button.addEventListener("click", () => {
      playgroundFullscreen = !playgroundFullscreen;
      renderApp();
    });
  });

  document.querySelectorAll("[data-playground-palette-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      playgroundPaletteCollapsed = !playgroundPaletteCollapsed;
      renderApp();
    });
  });

  document.querySelectorAll("[data-playground-visibility]").forEach((button) => {
    button.addEventListener("click", () => {
      const state = playgroundStateFor(playgroundProjectId(selectedProject));
      const node = playgroundNodeFor(state, button.dataset.playgroundVisibility);
      if (!node) return;
      node.hidden = !node.hidden;
      renderApp();
    });
  });

  document.querySelectorAll("[data-playground-type]").forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/playground-type", item.dataset.playgroundType);
      event.dataTransfer.effectAllowed = "copy";
    });
    item.addEventListener("click", () => addPlaygroundNode(item.dataset.playgroundType));
  });

  document.querySelectorAll("[data-playground-zoom]").forEach((button) => {
    button.addEventListener("click", () => setPlaygroundZoom(button.dataset.playgroundZoom));
  });

  canvas.addEventListener("pointerdown", startPlaygroundCanvasPan);

  canvas.addEventListener(
    "wheel",
    (event) => {
      if (event.target.closest(".playground-palette, .playground-toolbar, .playground-zoom-controls")) return;
      event.preventDefault();

      const shouldPan = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!shouldPan) {
        const direction = event.deltaY < 0 ? 0.08 : -0.08;
        setPlaygroundZoom(playgroundZoom + direction, event);
        return;
      }

      setPlaygroundPan({
        x: playgroundPan.x - event.deltaX,
        y: playgroundPan.y - event.deltaY,
      });
    },
    { passive: false }
  );

  canvas.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const typeId = event.dataTransfer.getData("text/playground-type");
    if (!typeId || !viewport) return;
    const rect = viewport.getBoundingClientRect();
    const x = (event.clientX - rect.left) / playgroundZoom - 112;
    const y = (event.clientY - rect.top) / playgroundZoom - 48;
    addPlaygroundNode(typeId, x, y);
  });

  document.querySelectorAll("[data-playground-node]").forEach((node) => {
    if (node.dataset.playgroundNode === "project") return;
    node.addEventListener("pointerdown", startPlaygroundNodeDrag);
  });

  requestAnimationFrame(drawPlaygroundConnectors);
}

function initPlaygroundDrawer() {
  document.querySelectorAll("[data-playground-add-item]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlaygroundDrawer = { mode: "add", nodeId: button.dataset.playgroundAddItem };
      renderApp();
    });
  });

  document.querySelectorAll("[data-playground-view-list]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlaygroundDrawer = { mode: "list", nodeId: button.dataset.playgroundViewList };
      renderApp();
    });
  });

  document.querySelectorAll("[data-playground-item-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlaygroundDrawer = {
        mode: "detail",
        nodeId: button.dataset.playgroundItemDetail,
        itemIndex: Number(button.dataset.playgroundItemIndex),
      };
      renderApp();
    });
  });

  document.querySelectorAll("[data-playground-drawer-close]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlaygroundDrawer = null;
      renderApp();
    });
  });

  const form = document.querySelector("[data-playground-add-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const context = playgroundDrawerContext();
    if (!context) return;
    const data = new FormData(form);
    const title = String(data.get("itemTitle") || "").trim();
    const note = String(data.get("itemNote") || "").trim();
    if (!title) return;
    context.node.items.push({ title, note });
    selectedPlaygroundDrawer = { mode: "list", nodeId: context.node.id };
    renderApp();
  });
}

function applyWbsSearchFilter(query) {
  const normalized = String(query || "").trim().toLowerCase();
  document.querySelectorAll("[data-wbs-row-id]").forEach((row) => {
    const matches = !normalized || row.dataset.wbsSearchText.toLowerCase().includes(normalized);
    row.classList.toggle("is-filtered", !matches);
  });
}

function initWbsGantt() {
  const wbsPage = document.querySelector(".wbs-page");
  if (!wbsPage) return;

  const search = document.querySelector("[data-wbs-search]");
  search?.addEventListener("input", (event) => {
    selectedWbsSearch = event.target.value;
    applyWbsSearchFilter(selectedWbsSearch);
  });

  document.querySelector("[data-wbs-view-by]")?.addEventListener("change", (event) => {
    selectedWbsViewBy = event.target.value;
    renderApp();
  });

  document.querySelectorAll("[data-wbs-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.wbsZoom;
      const next = selectedWbsZoom + (direction === "in" ? 0.1 : -0.1);
      selectedWbsZoom = Math.min(1.35, Math.max(0.75, Number(next.toFixed(2))));
      renderApp();
    });
  });

  const table = document.querySelector("[data-wbs-table-scroll]");
  const timeline = document.querySelector("[data-wbs-timeline-scroll]");
  if (table && timeline) {
    let syncing = false;
    const syncScroll = (source, target) => {
      if (syncing) return;
      syncing = true;
      target.scrollTop = source.scrollTop;
      requestAnimationFrame(() => {
        syncing = false;
      });
    };
    table.addEventListener("scroll", () => syncScroll(table, timeline));
    timeline.addEventListener("scroll", () => syncScroll(timeline, table));
  }
}

function initStageGateDrawer() {
  document.querySelectorAll("[data-stage-gate]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStageGate = button.dataset.stageGate;
      selectedReportProject = null;
      selectedPlaygroundDrawer = null;
      selectedView = "stages";
      renderApp();
    });
  });

  document.querySelectorAll("[data-stage-gate-close]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStageGate = null;
      renderApp();
    });
  });

  const form = document.querySelector("[data-stage-gate-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const context = stageGateContext(selectedStageGate);
    if (context?.status === "current") {
      stageAdvancements[context.profile.project] = Math.min(context.stageIndex + 1, stageDefinitions.length - 1);
    }
    selectedStageGate = null;
    selectedView = "stages";
    renderApp();
  });
}

function initReportDrawer() {
  document.querySelectorAll("[data-report-create]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedReportProject = button.dataset.reportCreate;
      selectedStageGate = null;
      selectedPlaygroundDrawer = null;
      notificationPanelOpen = false;
      renderApp();
    });
  });

  document.querySelectorAll("[data-report-close]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedReportProject = null;
      renderApp();
    });
  });

  const sectionButtons = Array.from(document.querySelectorAll("[data-report-section-target]"));
  const reportSections = Array.from(document.querySelectorAll("[data-report-section]"));
  const setActiveReportSection = (id) => {
    sectionButtons.forEach((button) => {
      const isActive = button.dataset.reportSectionTarget === id;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    reportSections.forEach((section) => {
      section.hidden = section.id !== id;
    });
  };

  sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.reportSectionTarget);
      if (!target) return;
      setActiveReportSection(target.id);
    });
  });

  const form = document.querySelector("[data-report-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selectedReportProject) {
      reportDrafts[selectedReportProject] = true;
    }
    selectedReportProject = null;
    renderApp();
  });
}

function initNotificationPanel() {
  document.querySelectorAll("[data-notification-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      notificationPanelOpen = !notificationPanelOpen;
      selectedStageGate = null;
      selectedReportProject = null;
      selectedPlaygroundDrawer = null;
      renderApp();
    });
  });

  document.querySelectorAll("[data-notification-close]").forEach((button) => {
    button.addEventListener("click", () => {
      notificationPanelOpen = false;
      renderApp();
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || (!notificationPanelOpen && !selectedReportProject && !selectedStageGate && !selectedPlaygroundDrawer)) return;
  notificationPanelOpen = false;
  selectedReportProject = null;
  selectedStageGate = null;
  selectedPlaygroundDrawer = null;
  renderApp();
});

renderApp();
