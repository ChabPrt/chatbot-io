export function Loading() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerText = 'Chargement';

    const dotsElement = document.createElement('span');
    dotsElement.className = 'dots';
    loadingElement.appendChild(dotsElement);

    let dots = '';
    const interval = setInterval(() => {
        dots = dots.length < 3 ? dots + '.' : '';
        dotsElement.innerText = dots;
    }, 500);

    loadingElement.stopLoading = () => {
        clearInterval(interval);
        loadingElement.remove();
    };

    return loadingElement;
}
