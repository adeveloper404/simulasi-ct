document.addEventListener('DOMContentLoaded', () => {

    // === LOGIKA NAVIGASI SIDEBAR & RESPONSIVITAS ===
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    // 1. Logika untuk highlight link aktif berdasarkan URL
    // Default ke index.html jika tidak ada path (misal: /)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });

    // 2. Logika mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 3. Logika klik di luar sidebar untuk menutupnya di mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains('active')) {
            // Pastikan menuToggle ada sebelum mengakses .contains
            if (!sidebar.contains(e.target) && (menuToggle && !menuToggle.contains(e.target))) {
                sidebar.classList.remove('active');
            }
        }
    });


    // === FUNGSI BANTUAN ===
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const getSpeed = (sliderId) => {
        const slider = document.getElementById(sliderId);
        return slider ? 1001 - slider.value : 500; // Default speed jika slider tdk ada
    };

    const setControlsDisabled = (simId, disabled) => {
        const section = document.getElementById(simId);
        if (section) {
            section.querySelectorAll('.controls button, .controls input, .controls select').forEach(el => {
                el.disabled = disabled;
            });
        }
    };

    // === 1. LOGIKA SORTING (HANYA JIKA ADA DI HALAMAN INI) ===
    const sortViz = document.getElementById('sorting-viz');
    if (sortViz) {
        const sortSizeInput = document.getElementById('sort-size');
        const sortGenerateBtn = document.getElementById('sort-generate');
        const sortStartBtn = document.getElementById('sort-start');
        const sortAlgorithmSelect = document.getElementById('sort-algorithm');
        const descBubble = document.getElementById('desc-bubble');
        const descInsertion = document.getElementById('desc-insertion');
        const descSelection = document.getElementById('desc-selection');
        let sortArray = [];

        const generateSortData = () => {
            sortArray = [];
            sortViz.innerHTML = '';
            const size = parseInt(sortSizeInput.value);
            for (let i = 0; i < size; i++) {
                const value = Math.floor(Math.random() * 95) + 5; // Nilai 5-100
                sortArray.push(value);
                const barContainer = document.createElement('div');
                barContainer.classList.add('bar-container');
                
                const bar = document.createElement('div');
                bar.classList.add('bar');
                bar.style.height = `${value * 2.5}px`; // Kalikan untuk tinggi
                bar.setAttribute('data-value', value);
                bar.textContent = value; // Tambahkan angka pada bar
                
                barContainer.appendChild(bar);
                sortViz.appendChild(barContainer);
            }
        };
        
        sortStartBtn.addEventListener('click', () => {
            const bars = document.querySelectorAll('#sorting-viz .bar');
            bars.forEach(bar => bar.classList.remove('sorted', 'compare', 'swap'));
        
            const selectedAlgorithm = sortAlgorithmSelect.value;
            if (selectedAlgorithm === 'bubble') {
                startBubbleSort();
            } else if (selectedAlgorithm === 'insertion') {
                startInsertionSort();
            } else if (selectedAlgorithm === 'selection') {
                startSelectionSort();
            }
        });

        sortAlgorithmSelect.addEventListener('change', () => {
            const selectedAlgorithm = sortAlgorithmSelect.value;
            descBubble.classList.remove('active');
            descInsertion.classList.remove('active');
            descSelection.classList.remove('active');
            
            if (selectedAlgorithm === 'bubble') {
                descBubble.classList.add('active');
            } else if (selectedAlgorithm === 'insertion') {
                descInsertion.classList.add('active');
            } else if (selectedAlgorithm === 'selection') {
                descSelection.classList.add('active');
            }
        });

        // --- Logika Bubble Sort ---
        const startBubbleSort = async () => {
            setControlsDisabled('sorting', true);
            const speed = getSpeed('sort-speed');
            const barContainers = Array.from(sortViz.children); 
            const n = barContainers.length;

            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    const bar1Container = barContainers[j];
                    const bar2Container = barContainers[j + 1];
                    const bar1 = bar1Container.querySelector('.bar');
                    const bar2 = bar2Container.querySelector('.bar');

                    bar1.classList.add('compare'); // Kuning
                    bar2.classList.add('compare'); // Kuning
                    await sleep(speed);

                    const val1 = parseInt(bar1.getAttribute('data-value'));
                    const val2 = parseInt(bar2.getAttribute('data-value'));

                    if (val1 > val2) {
                        bar1.classList.add('swap'); // Merah
                        bar2.classList.add('swap'); // Merah
                        await sleep(speed);
                        
                        // Tukar di array dan di DOM
                        [barContainers[j], barContainers[j+1]] = [barContainers[j+1], barContainers[j]];
                        sortViz.insertBefore(bar2Container, bar1Container);
                        
                        await sleep(speed);
                    }
                    
                    bar1.classList.remove('compare', 'swap');
                    bar2.classList.remove('compare', 'swap');
                }
                barContainers[n - i - 1].querySelector('.bar').classList.add('sorted');
            }
            barContainers[0].querySelector('.bar').classList.add('sorted');
            setControlsDisabled('sorting', false);
        };

        // --- Logika Insertion Sort ---
        const startInsertionSort = async () => {
            setControlsDisabled('sorting', true);
            const speed = getSpeed('sort-speed');
            const barContainers = Array.from(sortViz.children);
            const n = barContainers.length;
        
            barContainers[0].querySelector('.bar').classList.add('sorted');
        
            for (let i = 1; i < n; i++) {
                let keyContainer = barContainers[i];
                let keyBar = keyContainer.querySelector('.bar');
                let keyVal = parseInt(keyBar.getAttribute('data-value'));
        
                keyBar.classList.add('compare'); // Kuning: elemen 'key'
                await sleep(speed);
        
                let j = i - 1;
        
                while (j >= 0 && parseInt(barContainers[j].querySelector('.bar').getAttribute('data-value')) > keyVal) {
                    barContainers[j].querySelector('.bar').classList.add('swap'); // Merah: elemen 'digeser'
                    // Pindahkan bar container
                    barContainers[j+1] = barContainers[j];
                    await sleep(speed);
                    barContainers[j].querySelector('.bar').classList.remove('swap');
                    j--;
                }
                barContainers[j + 1] = keyContainer;
                
                keyBar.classList.remove('compare');
        
                // Re-render DOM based on array
                while (sortViz.firstChild) {
                    sortViz.removeChild(sortViz.firstChild);
                }
                barContainers.forEach(container => {
                    sortViz.appendChild(container);
                });
        
                await sleep(speed);
        
                for(let k = 0; k <= i; k++) {
                    barContainers[k].querySelector('.bar').classList.add('sorted');
                }
            }
            
            setControlsDisabled('sorting', false);
        };
        
        // --- Logika Selection Sort ---
        const startSelectionSort = async () => {
            setControlsDisabled('sorting', true);
            const speed = getSpeed('sort-speed');
            const barContainers = Array.from(sortViz.children);
            const n = barContainers.length;
        
            for (let i = 0; i < n - 1; i++) {
                let minIdx = i;
                let minBar = barContainers[i].querySelector('.bar');
                minBar.classList.add('swap'); // Tandai min sementara (Merah)
                
                for (let j = i + 1; j < n; j++) {
                    let currentBar = barContainers[j].querySelector('.bar');
                    currentBar.classList.add('compare'); // Tandai yg dicek (Kuning)
                    await sleep(speed);
        
                    const val1 = parseInt(minBar.getAttribute('data-value'));
                    const val2 = parseInt(currentBar.getAttribute('data-value'));
        
                    if (val2 < val1) {
                        minBar.classList.remove('swap'); // Hapus tanda min lama
                        minIdx = j;
                        minBar = barContainers[minIdx].querySelector('.bar');
                        minBar.classList.add('swap'); // Tandai min baru (Merah)
                    } else {
                        currentBar.classList.remove('compare'); // Hapus kuning jika tidak jadi min
                    }
                }
                
                if (minIdx !== i) {
                    let barA = barContainers[i]; // Elemen di posisi 'i'
                    let barB = barContainers[minIdx]; // Elemen 'min'
                    
                    barA.querySelector('.bar').classList.add('compare'); // Kuning
                    await sleep(speed);
        
                    // Tukar di array
                    [barContainers[i], barContainers[minIdx]] = [barContainers[minIdx], barContainers[i]];
        
                    // Tukar di DOM
                    let afterB = barB.nextSibling;
                    sortViz.insertBefore(barB, barA); // Pindahkan min (B) ke posisi i (A)
                    sortViz.insertBefore(barA, afterB); // Pindahkan A ke posisi B
                    
                    barA.querySelector('.bar').classList.remove('compare');
                }
        
                barContainers[i].querySelector('.bar').classList.remove('compare', 'swap');
                barContainers[i].querySelector('.bar').classList.add('sorted');
            }
            barContainers[n - 1].querySelector('.bar').classList.add('sorted');
            
            setControlsDisabled('sorting', false);
        };

        sortGenerateBtn.addEventListener('click', generateSortData);
        sortGenerateBtn.click(); // Generate data saat load
        sortAlgorithmSelect.dispatchEvent(new Event('change')); // Update deskripsi saat load
    } // Akhir dari 'if (sortViz)'

    // === 2. LOGIKA SEARCHING (HANYA JIKA ADA DI HALAMAN INI) ===
    const searchViz = document.getElementById('searching-viz');
    if (searchViz) {
        const searchSizeInput = document.getElementById('search-size');
        const searchTargetInput = document.getElementById('search-target');
        const searchGenerateBtn = document.getElementById('search-generate');
        const searchStartBtn = document.getElementById('search-start');
        
        // 👇 INI BAGIAN PENTING YANG HILANG DARI SCRIPT ANDA 👇
        const searchAlgorithmSelect = document.getElementById('search-algorithm');
        const descSequential = document.getElementById('desc-sequential');
        const descBinary = document.getElementById('desc-binary');
        
        let searchArray = [];

        const generateSearchData = () => {
            searchArray = [];
            searchViz.innerHTML = '';
            const size = parseInt(searchSizeInput.value);
            // Data dibuat terurut agar Binary Search berfungsi
            let startNum = Math.floor(Math.random() * 10) + 1;
            for (let i = 0; i < size; i++) {
                startNum += (Math.floor(Math.random() * 4) + 1);
                searchArray.push(startNum);
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.textContent = startNum;
                cell.setAttribute('data-index', i);
                cell.innerHTML += `<span class="label">idx: ${i}</span>`;
                searchViz.appendChild(cell);
            }
            // Set target ke salah satu data yang ada
            searchTargetInput.value = searchArray[Math.floor(Math.random() * searchArray.length)];
        };

        // --- FUNGSI SEQUENTIAL SEARCH ---
        const startSequentialSearch = async () => {
            setControlsDisabled('searching', true);
            const speed = getSpeed('search-speed');
            const target = parseInt(searchTargetInput.value);
            const cells = document.querySelectorAll('#searching-viz .cell');
            cells.forEach(c => c.classList.remove('checking', 'found', 'discarded', 'range'));
            let found = false;

            for (let i = 0; i < searchArray.length; i++) {
                const currentCell = cells[i];
                currentCell.classList.add('checking'); // Kuning
                await sleep(speed);

                if (searchArray[i] === target) {
                    currentCell.classList.replace('checking', 'found'); // Hijau
                    found = true;
                    break;
                } else {
                    currentCell.classList.remove('checking');
                    currentCell.classList.add('discarded'); // Abu-abu
                }
            }

            if (!found) alert(`Data '${target}' tidak ditemukan.`);
            setControlsDisabled('searching', false);
        };

        // --- FUNGSI BINARY SEARCH ---
        const startBinarySearch = async () => {
            setControlsDisabled('searching', true);
            const speed = getSpeed('search-speed');
            const target = parseInt(searchTargetInput.value);
            const cells = document.querySelectorAll('#searching-viz .cell');
            cells.forEach(c => c.classList.remove('checking', 'found', 'discarded', 'range'));
            let low = 0;
            let high = searchArray.length - 1;
            let found = false;

            while (low <= high) {
                // Tampilkan range pencarian
                cells.forEach((c, idx) => c.classList.toggle('range', idx >= low && idx <= high));
                await sleep(speed / 2);

                let mid = Math.floor((low + high) / 2);
                const midCell = cells[mid];
                const midVal = searchArray[mid];

                midCell.classList.add('checking');
                await sleep(speed);

                if (midVal === target) {
                    midCell.classList.replace('checking', 'found');
                    found = true;
                    break;
                } else if (target < midVal) {
                    // Buang bagian kanan
                    for (let i = mid; i <= high; i++) cells[i].classList.add('discarded');
                    high = mid - 1;
                } else {
                    // Buang bagian kiri
                    for (let i = low; i <= mid; i++) cells[i].classList.add('discarded');
                    low = mid + 1;
                }
                await sleep(speed);
                midCell.classList.remove('checking');
            }
            if (!found) alert(`Data '${target}' tidak ditemukan.`);
            cells.forEach(c => c.classList.remove('range'));
            setControlsDisabled('searching', false);
        };

        searchGenerateBtn.addEventListener('click', generateSearchData);
        
        // 👇 EVENT LISTENER UNTUK MENGGANTI DESKRIPSI 👇
        searchAlgorithmSelect.addEventListener('change', () => {
            const selectedAlgorithm = searchAlgorithmSelect.value;
            // Pastikan elemen deskripsi ada sebelum diubah
            if (descSequential && descBinary) { 
                descSequential.classList.remove('active');
                descBinary.classList.remove('active');
                
                if (selectedAlgorithm === 'sequential') {
                    descSequential.classList.add('active');
                } else if (selectedAlgorithm === 'binary') {
                    descBinary.classList.add('active');
                }
            }
        });

        // 👇 EVENT LISTENER UNTUK TOMBOL START (MEMILIH FUNGSI) 👇
        searchStartBtn.addEventListener('click', () => {
            const selectedAlgorithm = searchAlgorithmSelect.value;
            if (selectedAlgorithm === 'sequential') {
                startSequentialSearch();
            } else if (selectedAlgorithm === 'binary') {
                startBinarySearch();
            }
        });
        
        searchGenerateBtn.click();
        searchAlgorithmSelect.dispatchEvent(new Event('change')); // Update deskripsi saat load
    } // Akhir dari 'if (searchViz)'

    // === 3. LOGIKA STACK (HANYA JIKA ADA DI HALAMAN INI) ===
    const stackViz = document.getElementById('stack-viz');
    if (stackViz) {
        const stackValueInput = document.getElementById('stack-value');
        const stackPushBtn = document.getElementById('stack-push');
        const stackPopBtn = document.getElementById('stack-pop');
        const stackClearBtn = document.getElementById('stack-clear');
        let stackTopLabel = document.getElementById('stack-top-label'); 
        let stackData = [];

        const updateStackTopLabel = () => {
            const lastItem = stackViz.querySelector('.stack-item:last-of-type');
            if (lastItem) {
                stackTopLabel.classList.add('visible');
            } else {
                stackTopLabel.classList.remove('visible');
            }
        };

        const pushStack = () => {
            const value = stackValueInput.value.trim();
            if (!value) return;
            stackData.push(value);
            const item = document.createElement('div');
            item.classList.add('stack-item');
            item.textContent = value;
            stackViz.appendChild(item);
            stackValueInput.value = '';
            stackValueInput.focus();
            updateStackTopLabel();
        };

        const popStack = () => {
            if (stackData.length === 0) return;
            stackData.pop();
            const item = stackViz.querySelector('.stack-item:last-of-type'); 
            if (item) { 
                item.classList.add('pop');
                setTimeout(() => {
                    if (item.parentElement === stackViz) {
                        stackViz.removeChild(item);
                    }
                    updateStackTopLabel();
                }, 400);
            }
        };
        
        const clearStack = () => {
            stackData = [];
            stackViz.querySelectorAll('.stack-item').forEach(item => item.remove());
            updateStackTopLabel();
        };

        stackPushBtn.addEventListener('click', pushStack);
        stackPopBtn.addEventListener('click', popStack);
        stackClearBtn.addEventListener('click', clearStack);
        updateStackTopLabel();
    } // Akhir dari 'if (stackViz)'

    // === 4. LOGIKA QUEUE (HANYA JIKA ADA DI HALAMAN INI) ===
    const queueViz = document.getElementById('queue-viz');
    if (queueViz) {
        const queueValueInput = document.getElementById('queue-value');
        const queueEnqueueBtn = document.getElementById('queue-enqueue');
        const queueDequeueBtn = document.getElementById('queue-dequeue');
        const queueClearBtn = document.getElementById('queue-clear');
        let queueFrontLabel = document.getElementById('queue-front-label'); 
        let queueRearLabel = document.getElementById('queue-rear-label');
        let queueData = [];

        const updateQueueLabels = () => {
            const firstItem = queueViz.querySelector('.queue-item:first-of-type');
            const lastItem = queueViz.querySelector('.queue-item:last-of-type');
            
            if (firstItem && lastItem) {
                const firstRect = firstItem.getBoundingClientRect();
                const lastRect = lastItem.getBoundingClientRect();
                const vizRect = queueViz.getBoundingClientRect();

                queueFrontLabel.style.left = `${firstRect.left - vizRect.left + firstRect.width / 2}px`;
                queueFrontLabel.classList.add('visible');
                queueRearLabel.style.left = `${lastRect.left - vizRect.left + lastRect.width / 2}px`;
                queueRearLabel.classList.add('visible');
            } else {
                queueFrontLabel.classList.remove('visible');
                queueRearLabel.classList.remove('visible');
            }
        };

        const enqueue = () => {
            const value = queueValueInput.value.trim();
            if (!value) return;
            queueData.push(value);
            const item = document.createElement('div');
            item.classList.add('queue-item');
            item.textContent = value;
            queueViz.appendChild(item);
            queueValueInput.value = '';
            queueValueInput.focus();
            updateQueueLabels();
        };

        const dequeue = () => {
            if (queueData.length === 0) return;
            queueData.shift(); 
            const item = queueViz.querySelector('.queue-item'); 
            
            if (item) {
                item.classList.add('dequeue');
                setTimeout(() => {
                    if (item.parentElement === queueViz) {
                        queueViz.removeChild(item);
                    }
                    updateQueueLabels(); 
                }, 400);
            }
        };
        
        const clearQueue = () => {
            queueData = [];
            queueViz.querySelectorAll('.queue-item').forEach(item => item.remove());
            updateQueueLabels();
        };
        
        queueEnqueueBtn.addEventListener('click', enqueue);
        queueDequeueBtn.addEventListener('click', dequeue);
        queueClearBtn.addEventListener('click', clearQueue);
        updateQueueLabels();
    } // Akhir dari 'if (queueViz)'

});