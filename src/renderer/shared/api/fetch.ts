// get
// export const checkIsNewUser = () => axios.get(`${apiUrl}/checkIsNewUser`);
// export const getSidebarDatesForYear = (year) => axios.get(`${apiUrl}/getDatesByYear/${year}`);

// export const getCalendarModelData = () => axios.get(`${apiUrl}/getCalendar`);
// export const calendarLoadMore = (cursor) => axios.get(`${apiUrl}/loadMore/${cursor}`);
// export const calendarLoadMonth = (cursor) => axios.get(`${apiUrl}/loadMonth/${cursor}`);
// export const getDateEntryModel = (date) => axios.get(`${apiUrl}/getDateEntry/${date}`);
// export const getPaperById = (paperId) => axios.get(`${apiUrl}/paperById/${paperId}`);
// export const fetchPdf = (paperId) => axios.get(`${apiUrl}/fetchPdf/${paperId}`, { responseType: 'blob' });

// export const initializeChat = (paperId) => axios.get(`${apiUrl}/initializeChat/${paperId}`);
// export const getThreads = (paperId) => axios.get(`${apiUrl}/getThreads/${paperId}`);
// export const getMessages = (threadId) => axios.get(`${apiUrl}/getMessages/${threadId}`);

// post
// export const updateIsStarred = (paperId, value) => axios.post(`${apiUrl}/starPaper/${paperId}`, { value });
// export const updatePaperStatus = (paperId, status) => axios.post(`${apiUrl}/updatePaperStatus/${paperId}`, { status });
// export const resetDateStatus = (date) => axios.post(`${apiUrl}/reset/${date}`);
// export const scrapeDate = (date) => axios.post(`${apiUrl}/scrape/${date}`);
// export const searchPapers = (form) => axios.post(`${apiUrl}/searchPapers`, { form });

// export const onboard = (form) => axios.post(`${apiUrl}/onboardNewUser`, { form });
// export const addInitialReferences = (form) => axios.post(`${apiUrl}/addInitialReferences`, { form });

// export const loadBatchDates = (dateRange) => axios.post(`${apiUrl}/loadBatchDates`, dateRange);
// export const scrapeBatch = (dates) => axios.post(`${apiUrl}/scrapeBatch`, dates);
// export const getBatchDates = (params) => axios.post(`${apiUrl}/getBatchDates`, params);

// export const createThread = (params) => axios.post(`${apiUrl}/createThread`, params);
// export const branchThread = (params) => axios.post(`${apiUrl}/branchThread`, params);

// export const toggleHideMessage = (params) => axios.post(`${apiUrl}/toggleHideMessage`, params);
// export const deleteMessage = (messageId) => axios.post(`${apiUrl}/deleteMessage`, { messageId });
// export const sendMessage = (params) => axios.post(`${apiUrl}/sendMessage`, params);
// export const stopMessageStream = (threadId) => axios.post(`${apiUrl}/stopMessageStream`, { threadId });
// export const streamResponse = (params) => axios.post(`${apiUrl}/streamResponse`, params);
// export const regenerateResponse = (params) => axios.post(`${apiUrl}/regenerateResponse`, params);

export const loadBatchDates = window.api['load-batch-dates'];
export const getBatchDates = window.api['get-batch-dates'];
export const scrapeBatch = window.api['scrape-batch'];

export const getCalendarModelData = window.api['get-calendar'];
export const calendarLoadMore = window.api['load-more'];
export const calendarLoadMonth = window.api['load-month'];
export const resetDateStatus = window.api.reset;

export const initializeChat = window.api['initialize-chat'];
export const getThreads = window.api['get-threads'];
export const getMessages = window.api['get-messages'];
export const createThread = window.api['create-thread'];
export const branchThread = window.api['branch-thread'];
export const toggleHideMessage = window.api['toggle-hide-message'];
export const deleteMessage = window.api['delete-message'];
export const sendMessage = window.api['send-message'];
export const streamResponse = window.api['stream-response'];
export const stopMessageStream = window.api['stop-message-stream'];
export const regenerateResponse = window.api['regenerate-response'];

export const fetchPdf = window.api['fetch-pdf'];
export const getPaperById = window.api['paper-by-id'];
export const updateIsStarred = window.api['star-paper'];
export const updatePaperStatus = window.api['update-paper-status'];
export const getDateEntryModel = window.api['get-date-entry'];
export const searchPapers = window.api['search-papers'];
// export const checkIsNewUser = window.api['check-is-new-user']
export const checkIsNewUser = () => ({ data: false });

// export const updateWorkStatus = window.api['update-work-status']

export const addInitialReferences = window.api['add-initial-references'];
export const onboard = window.api['onboard-new-user'];

export const getSidebarDatesForYear = window.api['get-dates-by-year'];
export const scrapeDate = window.api['scrape-date'];
