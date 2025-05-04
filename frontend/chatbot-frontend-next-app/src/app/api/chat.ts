export interface ChatResponse {
    role: 'assistant' | 'user';
    content: string;
    figure?: any; // optional plotly figure
    request_id: string; // Request ID from backend
}

// Track the currently active request
let currentRequestId: string | null = null;

async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 100000
): Promise<Response> {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            // If fetch doesn't complete within 'timeout' ms, abort & reject
            controller.abort();
            reject(new Error('Request timed out'));
        }, timeout);

        fetch(url, { ...options, signal: controller.signal })
            .then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(timeoutId));
    });
}

/**
 * Cancel the current request if one is in progress
 */
export async function cancelCurrentRequest(): Promise<void> {
    if (currentRequestId) {
        try {
            await fetch(`http://127.0.0.1:8001/chat/${currentRequestId}`, {
                method: 'DELETE',
            });
            console.log(`Cancelled request ${currentRequestId}`);
        } catch (error) {
            console.error('Error cancelling request:', error);
        }
        currentRequestId = null;
    }
}

/**
 * sendChatMessage
 * 
 * Sends a chat request to the backend with user input + conversation history,
 * returning a ChatResponse if successful. Otherwise throws a user-friendly error
 * or server error message.
 */
// export async function sendChatMessage(payload: {
//     user_message: string;
//     history: { role: string; content: string }[];
// }): Promise<ChatResponse> {
//     // Cancel any existing request first
//     await cancelCurrentRequest();

//     // Generate a new request ID
//     const requestId = generateRequestId();
//     currentRequestId = requestId;

//     try {
//         const response = await fetchWithTimeout('http://127.0.0.1:8001/chat', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 ...payload,
//                 request_id: requestId
//             }),
//         });

//         // This request is complete, clear the currentRequestId
//         if (currentRequestId === requestId) {
//             currentRequestId = null;
//         }

//         if (!response.ok) {
//             let errorDetail = '';
//             try {
//                 const errorJson = await response.json();
//                 if (errorJson.detail) {
//                     errorDetail = errorJson.detail;
//                 }
//             } catch (parseError) { }

//             throw new Error(`Server Error (${response.status}): ${errorDetail || response.statusText}`);
//         }

//         return await response.json();
//     } catch (error: any) {
//         // This request is complete, clear the currentRequestId
//         if (currentRequestId === requestId) {
//             currentRequestId = null;
//         }

//         if (error.name === 'AbortError') {
//             // Try to cancel the request on the server if it was aborted
//             await cancelCurrentRequest();
//             throw new Error('Request timed out. Please try again.');
//         } else if (error.message === 'Failed to fetch') {
//             throw new Error('Cannot connect to the server. Please check your internet or try again later.');
//         }

//         throw error;
//     }
// }
export async function sendChatMessage(payload: {
    user_message: string;
    history: { role: string; content: string }[];
}): Promise<ChatResponse> {
    // Instead of making a real request, just return a dummy ChatResponse
    // const content = "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    const content = "لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسكيغ إليت، سيد دو إييوسمد تيمبور إنسييديدونت يوت لابوري إت دولوري مينيام، كيويس نولامكو لابوريس نيسي يوت أليكويب إكس إي كومودو كونسيكوات. دويس أوتي إيرور دولور إن ريبريهيندريريت إن فولوباتي فيليت إيسي سيليم دولوري إيو فيوجات نولا بارياتي. إكسسبيتيور سينت أوكيات كويبيدات نون بروفيدنت، سونت إن كولبا كوي أوفيسيا ديسيرنت موليت أنيم إد إيست لابوروم."

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                role: 'assistant',
                content: content,
                figure: null,
                request_id: 'dummy-request-id-' + Math.random().toString(36).substring(2),
            });
        }, 500); // optional fake delay (500ms)
    });
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}