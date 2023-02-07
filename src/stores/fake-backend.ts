const timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const refreshPlayingInfo = async (): Promise<Response> => {
    await timeout(1000);
    return await fetch('/mockdata/fake-backend-data.json');
}