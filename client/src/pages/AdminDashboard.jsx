import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ language = "en", setLanguage }) {
  const navigate = useNavigate();
  const isFa = language === "fa";

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedLead, setSelectedLead] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingLeadId, setUpdatingLeadId] = useState("");

  const text = {
    title: isFa ? "داشبورد مدیریت درخواست ها" : "Lead Command Center",
    subtitle: isFa
      ? "مرکز حرفه ای مدیریت درخواست های ورودی پروژه های خورشیدی"
      : "A polished workspace for reviewing and managing incoming solar leads.",
    logout: isFa ? "خروج" : "Logout",
    refresh: isFa ? "بروزرسانی" : "Refresh",
    newest: isFa ? "جدیدترین اول" : "Newest first",
    oldest: isFa ? "قدیمی ترین اول" : "Oldest first",
    all: isFa ? "همه" : "All",
    residential: isFa ? "مسکونی" : "Residential",
    commercial: isFa ? "تجاری" : "Commercial",
    land: isFa ? "زمین" : "Land",
    utility: isFa ? "نیروگاهی" : "Utility",
    loading: isFa ? "در حال بارگذاری..." : "Loading...",
    noLeads: isFa ? "درخواستی پیدا نشد." : "No leads found.",
    noLeadsSub: isFa
      ? "فیلترها یا عبارت جستجو را تغییر دهید."
      : "Try changing your search or filters.",
    search: isFa ? "جستجو در نام، ایمیل، تلفن یا موقعیت" : "Search by name, email, phone, or location",
    inquiryType: isFa ? "نوع درخواست" : "Inquiry type",
    statusFilter: isFa ? "فیلتر وضعیت" : "Status filter",
    sortBy: isFa ? "مرتب سازی" : "Sort by",
    details: isFa ? "جزئیات درخواست" : "Lead Details",
    close: isFa ? "بستن" : "Close",
    attachments: isFa ? "پیوست ها" : "Attachments",
    notes: isFa ? "یادداشت داخلی" : "Internal Notes",
    save: isFa ? "ذخیره" : "Save Notes",
    saving: isFa ? "در حال ذخیره..." : "Saving...",
    total: isFa ? "کل درخواست ها" : "Total Leads",
    newLeads: isFa ? "درخواست های جدید" : "New",
    inProgress: isFa ? "در حال پیگیری" : "In Progress",
    closed: isFa ? "بسته شده" : "Closed",
    listTitle: isFa ? "درخواست های اخیر" : "Recent Leads",
    listSubtitle: isFa
      ? "نمای جمع بندی شده هر درخواست برای بررسی سریع"
      : "A premium summary view built for fast triage and follow-up.",
    contact: isFa ? "اطلاعات تماس" : "Contact Info",
    project: isFa ? "جزئیات پروژه" : "Project Details",
    pipeline: isFa ? "وضعیت و امتیاز" : "Pipeline Details",
    timestamps: isFa ? "زمان بندی" : "Timestamps",
    name: isFa ? "نام" : "Name",
    email: isFa ? "ایمیل" : "Email",
    phone: isFa ? "تلفن" : "Phone",
    country: isFa ? "کشور" : "Country",
    address: isFa ? "آدرس" : "Address",
    preferredContact: isFa ? "روش تماس ترجیحی" : "Preferred Contact",
    type: isFa ? "نوع" : "Type",
    location: isFa ? "موقعیت" : "Location",
    landSize: isFa ? "متراژ زمین" : "Land Size",
    monthlyBill: isFa ? "قبض ماهانه" : "Monthly Bill",
    energyUsage: isFa ? "مصرف انرژی" : "Energy Usage",
    timeline: isFa ? "زمان بندی" : "Timeline",
    score: isFa ? "امتیاز درخواست" : "Lead Score",
    priority: isFa ? "اولویت" : "Priority",
    status: isFa ? "وضعیت" : "Status",
    created: isFa ? "ایجاد شده" : "Created",
    updated: isFa ? "بروزرسانی شده" : "Updated",
    message: isFa ? "پیام" : "Message",
    interestReasons: isFa ? "دلایل علاقه" : "Interest Reasons",
    noUploads: isFa ? "فایلی وجود ندارد" : "No attachments",
    unnamedLead: isFa ? "درخواست بدون نام" : "Unnamed Lead",
    noEmail: isFa ? "بدون ایمیل" : "No email",
    noPhone: isFa ? "بدون تلفن" : "No phone",
    noData: "-",
    emptyNotes: isFa ? "هنوز یادداشتی ثبت نشده است." : "No internal notes added yet.",
    statusNew: isFa ? "جدید" : "New",
    statusContacted: isFa ? "تماس گرفته شده" : "Contacted",
    statusQuoted: isFa ? "پیشنهاد ارسال شده" : "Quoted",
    statusClosed: isFa ? "بسته شده" : "Closed",
    normal: isFa ? "عادی" : "Normal",
    medium: isFa ? "متوسط" : "Medium",
    high: isFa ? "بالا" : "High",
    priorityLabel: isFa ? "اولویت بالا" : "Priority Lead",
    notesSaved: isFa ? "یادداشت ذخیره شد" : "Notes saved",
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
  });

  const getInquiryTypeLabel = (type) => {
    const map = {
      residential: text.residential,
      commercial: text.commercial,
      land: text.land,
      utility: text.utility,
    };

    return map[type] || type || text.noData;
  };

  const getStatusLabel = (status) => {
    const map = {
      new: text.statusNew,
      contacted: text.statusContacted,
      quoted: text.statusQuoted,
      closed: text.statusClosed,
    };

    return map[status] || status || text.noData;
  };

  const getPriorityLabel = (priority) => {
    if (priority === "high") return text.high;
    if (priority === "medium") return text.medium;
    return text.normal;
  };

  const getPriorityClasses = (priority) => {
    if (priority === "high") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (priority === "medium") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  const getStatusClasses = (status) => {
    if (status === "closed") return "bg-slate-900 text-white";
    if (status === "quoted") return "bg-amber-100 text-amber-800";
    if (status === "contacted") return "bg-sky-100 text-sky-800";
    return "bg-emerald-100 text-emerald-800";
  };

  const formatDateTime = (value) => {
    if (!value) return text.noData;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return text.noData;

    return date.toLocaleString(isFa ? "fa-IR" : undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getLeadLocation = (lead) =>
    lead?.projectDetails?.projectLocation ||
    lead?.projectDetails?.landLocation ||
    lead?.contact?.cityAddress ||
    text.noData;

  const getProjectPairs = (lead) => [
    { label: text.type, value: getInquiryTypeLabel(lead?.inquiryType) },
    { label: text.location, value: getLeadLocation(lead) },
    { label: text.landSize, value: lead?.projectDetails?.landSize || text.noData },
    { label: text.monthlyBill, value: lead?.projectDetails?.monthlyBill || text.noData },
    { label: text.energyUsage, value: lead?.projectDetails?.energyUsage || text.noData },
    { label: text.timeline, value: lead?.timeline || text.noData },
  ];

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leads`,
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        navigate("/admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch leads");
      }

      setLeads(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      navigate("/admin-login");
    });
  };

  const handleStatusChange = async (leadId, status) => {
    try {
      setUpdatingLeadId(leadId);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leads/${leadId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        navigate("/admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update status");
      }

      setLeads((prev) => prev.map((lead) => (lead._id === leadId ? result.data : lead)));
      if (selectedLead?._id === leadId) setSelectedLead(result.data);
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingLeadId("");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;

    try {
      setSavingNotes(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leads/${selectedLead._id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ adminNotes: selectedLead.adminNotes || "" }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        navigate("/admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to save notes");
      }

      setLeads((prev) =>
        prev.map((lead) => (lead._id === selectedLead._id ? result.data : lead))
      );
      setSelectedLead(result.data);
    } catch (err) {
      alert(err.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((lead) => lead?.status === "new").length;
    const inProgressCount = leads.filter(
      (lead) => lead?.status === "contacted" || lead?.status === "quoted"
    ).length;
    const closedCount = leads.filter((lead) => lead?.status === "closed").length;

    return { total, newCount, inProgressCount, closedCount };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesType = selectedType === "all" || lead?.inquiryType === selectedType;
        const matchesStatus = selectedStatus === "all" || lead?.status === selectedStatus;

        const haystack = [
          lead?.contact?.fullName,
          lead?.contact?.email,
          lead?.contact?.phone,
          lead?.projectDetails?.projectLocation,
          lead?.projectDetails?.landLocation,
          lead?.contact?.cityAddress,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = haystack.includes(searchTerm.trim().toLowerCase());

        return matchesType && matchesStatus && (searchTerm.trim() === "" || matchesSearch);
      })
      .sort((a, b) => {
        const aDate = new Date(a?.createdAt).getTime();
        const bDate = new Date(b?.createdAt).getTime();
        return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
      });
  }, [leads, searchTerm, selectedStatus, selectedType, sortOrder]);

  const statCards = [
    {
      key: "total",
      label: text.total,
      value: stats.total,
      accent: "from-slate-950 via-slate-900 to-slate-800 text-white",
      subtext: isFa ? "نمای کلی پایپ لاین" : "Full pipeline visibility",
    },
    {
      key: "new",
      label: text.newLeads,
      value: stats.newCount,
      accent: "from-emerald-50 to-white text-slate-900",
      subtext: isFa ? "نیازمند بررسی اولیه" : "Awaiting first review",
    },
    {
      key: "progress",
      label: text.inProgress,
      value: stats.inProgressCount,
      accent: "from-sky-50 to-white text-slate-900",
      subtext: isFa ? "در حال پیگیری فعال" : "Active follow-up underway",
    },
    {
      key: "closed",
      label: text.closed,
      value: stats.closedCount,
      accent: "from-amber-50 to-white text-slate-900",
      subtext: isFa ? "فرصت های نهایی شده" : "Resolved opportunities",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-[radial-gradient(circle_at_top,#fff9ef_0%,#f7f2e8_40%,#f2ece1_100%)] px-4 py-6 sm:px-6 lg:px-8 ${isFa ? "text-right" : "text-left"}`}
    >
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[36px] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(30,41,59,0.96)_45%,rgba(71,85,105,0.93)_100%)] px-6 py-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:px-8 lg:px-10">
          <div
            className={`flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between ${isFa ? "lg:flex-row-reverse" : ""}`}
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {text.title}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                {isFa ? "مرکز فرمان مدیریت درخواست ها" : "Premium Lead Operations"}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {text.subtitle}
              </p>
            </div>

            <div className={`flex flex-wrap gap-3 ${isFa ? "justify-start" : "justify-end"}`}>
              <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`min-w-[64px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                    language === "en"
                      ? "bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.16)]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("fa")}
                  className={`min-w-[64px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                    language === "fa"
                      ? "bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.16)]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  FA
                </button>
              </div>

              <button
                type="button"
                onClick={fetchLeads}
                className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                {text.refresh}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                {text.logout}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-[28px] border border-white/70 bg-gradient-to-br ${card.accent} p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-current/70">
                {card.label}
              </p>
              <p className="mt-4 text-4xl font-black tracking-[-0.04em]">{card.value}</p>
              <p className="mt-3 text-sm text-current/70">{card.subtext}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] border border-[#e6dcc8] bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
          <div
            className={`mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between ${isFa ? "lg:flex-row-reverse" : ""}`}
          >
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">
                {text.listTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">{text.listSubtitle}</p>
            </div>
            <div className="rounded-full border border-[#ebe1cf] bg-[#fbf8f2] px-4 py-2 text-sm font-medium text-slate-600">
              {filteredLeads.length} / {stats.total}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,0.7fr))]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {text.search}
              </span>
              <input
                type="text"
                placeholder={text.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd3c1] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {text.inquiryType}
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd3c1] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              >
                <option value="all">{text.all}</option>
                <option value="residential">{text.residential}</option>
                <option value="commercial">{text.commercial}</option>
                <option value="land">{text.land}</option>
                <option value="utility">{text.utility}</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {text.statusFilter}
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd3c1] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              >
                <option value="all">{text.all}</option>
                <option value="new">{text.statusNew}</option>
                <option value="contacted">{text.statusContacted}</option>
                <option value="quoted">{text.statusQuoted}</option>
                <option value="closed">{text.statusClosed}</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {text.sortBy}
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd3c1] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              >
                <option value="newest">{text.newest}</option>
                <option value="oldest">{text.oldest}</option>
              </select>
            </label>
          </div>
        </section>

        {loading && (
          <div className="mt-8 rounded-[28px] border border-[#e7dcc7] bg-white p-8 text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            {text.loading}
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-[28px] border border-red-200 bg-red-50 p-8 text-red-600 shadow-[0_18px_50px_rgba(239,68,68,0.08)]">
            {error}
          </div>
        )}

        {!loading && !error && filteredLeads.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-[#e7dcc7] bg-white p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <h3 className="text-2xl font-semibold text-slate-900">{text.noLeads}</h3>
            <p className="mt-3 text-slate-500">{text.noLeadsSub}</p>
          </div>
        )}

        {!loading && !error && filteredLeads.length > 0 && (
          <section className="mt-8 space-y-4">
            {filteredLeads.map((lead) => (
              <button
                key={lead?._id}
                type="button"
                onClick={() => setSelectedLead(lead)}
                className="w-full rounded-[30px] border border-[#e6dcc8] bg-white px-5 py-5 text-left shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:px-6"
              >
                <div
                  className={`flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between ${isFa ? "xl:flex-row-reverse text-right" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className={`flex flex-wrap items-center gap-3 ${isFa ? "justify-start" : ""}`}
                    >
                      <h3 className="truncate text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                        {lead?.contact?.fullName || text.unnamedLead}
                      </h3>
                      {lead?.priority && (
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(lead.priority)}`}
                        >
                          {getPriorityLabel(lead.priority)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                      <p className="truncate">
                        <span className="font-medium text-slate-800">{text.email}:</span>{" "}
                        {lead?.contact?.email || text.noEmail}
                      </p>
                      <p className="truncate">
                        <span className="font-medium text-slate-800">{text.phone}:</span>{" "}
                        {lead?.contact?.phone || text.noPhone}
                      </p>
                      <p className="truncate">
                        <span className="font-medium text-slate-800">{text.created}:</span>{" "}
                        {formatDateTime(lead?.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`grid gap-3 sm:grid-cols-2 xl:min-w-[360px] ${isFa ? "text-right" : "text-left"}`}
                  >
                    <div className="rounded-2xl border border-[#eee4d3] bg-[#fcfaf6] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {text.inquiryType}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {getInquiryTypeLabel(lead?.inquiryType)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#eee4d3] bg-[#fcfaf6] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {text.status}
                      </p>
                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(lead?.status)}`}
                      >
                        {getStatusLabel(lead?.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </section>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />

          <aside
            className={`h-full w-full max-w-[540px] overflow-y-auto border-l border-[#e8decb] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f3ea_100%)] p-6 shadow-[-24px_0_80px_rgba(15,23,42,0.18)] sm:p-7 ${isFa ? "text-right" : "text-left"}`}
          >
            <div
              className={`flex items-start justify-between gap-4 ${isFa ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {text.details}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900">
                  {selectedLead?.contact?.fullName || text.unnamedLead}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedLead?.contact?.email || text.noEmail} {" • "}
                  {selectedLead?.contact?.phone || text.noPhone}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-full border border-[#ddd3c1] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
              >
                {text.close}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(selectedLead?.status)}`}
              >
                {getStatusLabel(selectedLead?.status)}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(selectedLead?.priority)}`}
              >
                {getPriorityLabel(selectedLead?.priority)}
              </span>
              <span className="inline-flex rounded-full border border-[#e5dbc8] bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {text.score}: {selectedLead?.leadScore ?? 0}
              </span>
            </div>

            <div className="mt-8 space-y-5">
              <section className="rounded-[28px] border border-[#e5dbc8] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <h3 className="text-lg font-semibold text-slate-900">{text.contact}</h3>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p><span className="font-medium text-slate-800">{text.name}:</span> {selectedLead?.contact?.fullName || text.noData}</p>
                  <p><span className="font-medium text-slate-800">{text.email}:</span> {selectedLead?.contact?.email || text.noData}</p>
                  <p><span className="font-medium text-slate-800">{text.phone}:</span> {selectedLead?.contact?.phone || text.noData}</p>
                  <p><span className="font-medium text-slate-800">{text.country}:</span> {selectedLead?.contact?.country || text.noData}</p>
                  <p className="sm:col-span-2"><span className="font-medium text-slate-800">{text.address}:</span> {selectedLead?.contact?.cityAddress || text.noData}</p>
                  <p className="sm:col-span-2"><span className="font-medium text-slate-800">{text.preferredContact}:</span> {selectedLead?.contact?.preferredContactMethod || text.noData}</p>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#e5dbc8] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <h3 className="text-lg font-semibold text-slate-900">{text.project}</h3>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  {getProjectPairs(selectedLead).map((item) => (
                    <p key={item.label}>
                      <span className="font-medium text-slate-800">{item.label}:</span> {item.value}
                    </p>
                  ))}
                  <p className="sm:col-span-2">
                    <span className="font-medium text-slate-800">{text.message}:</span>{" "}
                    {selectedLead?.message || text.noData}
                  </p>
                  <div className="sm:col-span-2">
                    <p className="font-medium text-slate-800">{text.interestReasons}:</p>
                    {selectedLead?.interestReasons?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedLead.interestReasons.map((reason, index) => (
                          <span
                            key={`${reason}-${index}`}
                            className="rounded-full bg-[#f6efe3] px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">{text.noData}</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#e5dbc8] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <h3 className="text-lg font-semibold text-slate-900">{text.pipeline}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#ece2d0] bg-[#fcfaf6] p-4">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {text.status}
                    </label>
                    <select
                      value={selectedLead?.status || "new"}
                      onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                      disabled={updatingLeadId === selectedLead?._id}
                      className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="new">{text.statusNew}</option>
                      <option value="contacted">{text.statusContacted}</option>
                      <option value="quoted">{text.statusQuoted}</option>
                      <option value="closed">{text.statusClosed}</option>
                    </select>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-[#ece2d0] bg-[#fcfaf6] p-4 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {text.score}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {selectedLead?.leadScore ?? 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#ece2d0] bg-[#fcfaf6] p-4 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {text.priority}
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {getPriorityLabel(selectedLead?.priority)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p><span className="font-medium text-slate-800">{text.created}:</span> {formatDateTime(selectedLead?.createdAt)}</p>
                  <p><span className="font-medium text-slate-800">{text.updated}:</span> {formatDateTime(selectedLead?.updatedAt)}</p>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#e5dbc8] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <h3 className="text-lg font-semibold text-slate-900">{text.notes}</h3>
                <textarea
                  value={selectedLead?.adminNotes || ""}
                  onChange={(e) =>
                    setSelectedLead((prev) => ({ ...prev, adminNotes: e.target.value }))
                  }
                  className="mt-4 min-h-36 w-full rounded-3xl border border-[#d8cfbf] bg-[#fcfaf6] px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                  placeholder={text.emptyNotes}
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">{text.notesSaved}</p>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingNotes ? text.saving : text.save}
                  </button>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#e5dbc8] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <h3 className="text-lg font-semibold text-slate-900">{text.attachments}</h3>
                {selectedLead?.attachments?.length ? (
                  <div className="mt-4 space-y-3">
                    {selectedLead.attachments.map((file, index) => (
                      <a
                        key={`${file?.fileUrl || file?.originalName || "file"}-${index}`}
                        href={file?.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-[#ece2d0] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300 hover:bg-white"
                      >
                        <span className="truncate font-medium text-slate-900">
                          {file?.originalName || "Unnamed file"}
                        </span>
                        <span className="ml-4 text-xs text-slate-500">
                          {typeof file?.size === "number"
                            ? `${(file.size / 1024).toFixed(1)} KB`
                            : text.noData}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">{text.noUploads}</p>
                )}
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
