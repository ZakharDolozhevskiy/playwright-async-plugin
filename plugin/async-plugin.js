let observer = null;

const watcherTasks = [];

const watcherResults = [];

// Simulate DOM interaction that takes some time to be completed
const runTask = () => {
    console.log('schedule task');
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('scheduled task completed');
            resolve(Math.random());
        }, 1500);
    });
}

export const startChangeWatcher = (page) => {
    page.on('load', () => {
        page.evaluate(async () => {
            const root = document.querySelector('body')

            const mutationCallback = (mutationsList) => {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                console.log('Element added:', node);
                                runTask();
                            }
                        });
                    }
                }
            };

            observer = new MutationObserver(mutationCallback);
            observer.observe(root, { childList: true, subtree: true });
            return observer
        }).then(_observer => observer = _observer)

        runTask()
    })
}

export const stopChangeWatcher = async () => {
    return Promise.all(watcherTasks).then(() => {
        const output = watcherResults.slice()
        watcherResults.length = 0
        watcherTasks.length = 0
        return output
    })
}