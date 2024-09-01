chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = tab.url;

        // Inject specific CSS based on the URL
        if (url.includes('*://www.amazon.com.mx/cpe/*')) 
            {
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["profile.css"]
            });
        } 
        
        else 
        {
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["payments.css"]
            });
        }
    }
});