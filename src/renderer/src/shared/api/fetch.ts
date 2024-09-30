import axios from 'axios';
import { io } from "socket.io-client";

const apiUrl = 'http://localhost:3000';
export const socket = io(apiUrl);
socket.on('connect', () => console.log('Connected to WebSocket server'));
// socket.onAny((event, ...args) => console.log('socket event:', {event}, args));

// get
export const checkIsNewUser = () => axios.get(`${apiUrl}/checkIsNewUser`);
export const getSidebarDatesForYear = (year) => axios.get(`${apiUrl}/getDatesByYear/${year}`);

export const getCalendarModelData = () => axios.get(`${apiUrl}/getCalendar`);
export const calendarLoadMore = (cursor) => axios.get(`${apiUrl}/loadMore/${cursor}`);
export const calendarLoadMonth = (cursor) => axios.get(`${apiUrl}/loadMonth/${cursor}`);
export const getDateEntryModel = (date) => axios.get(`${apiUrl}/getDateEntry/${date}`);
export const getPaperById = (paperId) => axios.get(`${apiUrl}/paperById/${paperId}`);
export const fetchPdf = (paperId) => axios.get(`${apiUrl}/fetchPdf/${paperId}`, { responseType: 'blob' });

export const initializeChat = (paperId) => axios.get(`${apiUrl}/initializeChat/${paperId}`);
export const getThreads = (paperId) => axios.get(`${apiUrl}/getThreads/${paperId}`);
export const getMessages = (threadId) => axios.get(`${apiUrl}/getMessages/${threadId}`);

// post
export const updateIsStarred = (paperId, value) => axios.post(`${apiUrl}/starPaper/${paperId}`, { value });
export const updatePaperStatus = (paperId, status) => axios.post(`${apiUrl}/updatePaperStatus/${paperId}`, { status });
export const resetDateStatus = (date) => axios.post(`${apiUrl}/reset/${date}`);
export const scrapeDate = (date) => axios.post(`${apiUrl}/scrape/${date}`);
export const searchPapers = (form) => axios.post(`${apiUrl}/searchPapers`, { form });

export const onboard = (form) => axios.post(`${apiUrl}/onboardNewUser`, { form });
export const addInitialReferences = (form) => axios.post(`${apiUrl}/addInitialReferences`, { form });

export const loadBatchDates = (dateRange) => axios.post(`${apiUrl}/loadBatchDates`, dateRange);
export const scrapeBatch = (dates) => axios.post(`${apiUrl}/scrapeBatch`, dates);
export const getBatchDates = (params) => axios.post(`${apiUrl}/getBatchDates`, params);

export const createThread = (params) => axios.post(`${apiUrl}/createThread`, params);
export const branchThread = (params) => axios.post(`${apiUrl}/branchThread`, params);

export const toggleHideMessage = (params) => axios.post(`${apiUrl}/toggleHideMessage`, params);
export const deleteMessage = (messageId) => axios.post(`${apiUrl}/deleteMessage`, { messageId });
export const sendMessage = (params) => axios.post(`${apiUrl}/sendMessage`, params);
export const stopMessageStream = (threadId) => axios.post(`${apiUrl}/stopMessageStream`, { threadId });
export const streamResponse = (params) => axios.post(`${apiUrl}/streamResponse`, params);
export const regenerateResponse = (params) => axios.post(`${apiUrl}/regenerateResponse`, params);