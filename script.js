
const files = [
    "BS_0.md",
    "BS_1.md",
    "BS_2.md",
    "BS_3.md",
    "BS_4.md",
    "BS_5.md",
    "BS_6.md",
    "BS_7.md",
    "BS_8.md",
    "BS_9.md",
    "BS_10.md",
    "BS_11.md",
    "BS_12.md",
    "BS_13.md",
    "BS_14.md",
    "BS_15.md",
    "BS_16.md",
    "BS_17.md",
    "BS_18.md",
    "BS_19.md",
    "BS_20.md"
];

const fileList = document.getElementById("fileList");
const content = document.getElementById("content");
const themeToggle = document.getElementById("themeToggle");
const downloadToggle = document.getElementById("downloadToggle");
const downloadOptions = document.getElementById("downloadOptions");
const downloadMenuWrapper = document.querySelector(".download-menu");
const divider = document.getElementById("divider");
const searchInput = document.getElementById("fileSearch");
const prevButton = document.getElementById("prevFile");
const nextButton = document.getElementById("nextFile");
const headerEl = document.querySelector("header");
const highlightThemes = {
    light: document.getElementById("hljsLightTheme"),
    dark: document.getElementById("hljsDarkTheme")
};
const downloadOptionButtons = downloadOptions ? Array.from(downloadOptions.querySelectorAll("button[data-format]")) : [];
const enhanceTables = () => {
    content.querySelectorAll("table").forEach((table) => {
        if (table.parentElement && table.parentElement.classList.contains("table-responsive")) {
            return;
        }
        const wrapper = document.createElement("div");
        wrapper.className = "table-responsive";
        const parent = table.parentElement;
        if (!parent) {
            return;
        }
        parent.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
};

const resetScrollPosition = () => {
    // Ensure new content always starts at the top of the viewport
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "auto" });
};

const THEME_KEY = "bootstrap-notes-theme";
const SIDEBAR_WIDTH_KEY = "bootstrap-notes-sidebar-width";
const mediaQuery = window.matchMedia("(max-width: 768px)");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getNumberVar = (name) => {
    const value = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isNaN(value) ? 0 : value;
};

const updateHeaderHeight = () => {
    if (!headerEl) {
        return;
    }
    document.documentElement.style.setProperty("--header-height", `${headerEl.offsetHeight}px`);
};

const formatLabel = (file) => file.replace(/\.md$/i, "");

let currentSidebarWidth = getNumberVar("--sidebar-width") || 240;
let currentFileIndex = 0;
let isDragging = false;
let isDownloadMenuOpen = false;
let currentRenderToken = 0;

const getCurrentFilename = () => {
    const fallback = files[0] || "note.md";
    return files[currentFileIndex] || fallback;
};

const getCurrentBasename = () => formatLabel(getCurrentFilename());

const defaultTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const toggleHighlightTheme = (theme) => {
    highlightThemes.light.disabled = theme === "dark";
    highlightThemes.dark.disabled = theme !== "dark";
    if (window.hljs) {
        window.hljs.highlightAll();
    }
};

const openDownloadMenu = () => {
    if (!downloadOptions || !downloadToggle) {
        return;
    }
    isDownloadMenuOpen = true;
    downloadOptions.hidden = false;
    downloadOptions.classList.add("is-open");
    downloadToggle.setAttribute("aria-expanded", "true");
    if (downloadOptionButtons.length > 0) {
        downloadOptionButtons[0].focus();
    }
};

const closeDownloadMenu = () => {
    if (!downloadOptions || !downloadToggle) {
        return;
    }
    isDownloadMenuOpen = false;
    downloadOptions.classList.remove("is-open");
    downloadOptions.hidden = true;
    downloadToggle.setAttribute("aria-expanded", "false");
};

const toggleDownloadMenu = () => {
    if (isDownloadMenuOpen) {
        closeDownloadMenu();
    } else {
        openDownloadMenu();
    }
};

const captureContentCanvas = async () => {
    if (typeof window.html2canvas !== "function") {
        throw new Error("Capture library is unavailable.");
    }
    const backgroundColor = getComputedStyle(document.body).getPropertyValue("background-color") || "#ffffff";
    return window.html2canvas(content, {
        backgroundColor: backgroundColor.trim() || undefined,
        scrollY: 0,
        useCORS: true
    });
};

const withBusyState = async (button, task) => {
    if (typeof task !== "function") {
        return;
    }
    if (!button) {
        try {
            await task();
        } catch (error) {
            console.error(error);
            alert("Unable to prepare the download. Please try again.");
        }
        return;
    }
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Preparing...";
    button.setAttribute("aria-busy", "true");
    try {
        await task();
    } catch (error) {
        console.error(error);
        alert("Unable to prepare the download. Please try again.");
    } finally {
        button.disabled = false;
        button.textContent = originalText;
        button.removeAttribute("aria-busy");
    }
};

const downloadAsPng = async () => {
    const canvas = await captureContentCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${getCurrentBasename()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
};

const downloadAsPdf = async () => {
    if (!window.jspdf || typeof window.jspdf.jsPDF !== "function") {
        throw new Error("PDF library is unavailable.");
    }
    const { jsPDF } = window.jspdf;
    const canvas = await captureContentCanvas();
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save(`${getCurrentBasename()}.pdf`);
};

const applyTheme = (theme) => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.toggle("light-theme", theme === "light");
    themeToggle.textContent = theme === "dark" ? "Switch to Light" : "Switch to Dark";
    toggleHighlightTheme(theme);
};

const loadTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    const theme = stored === "dark" || stored === "light" ? stored : defaultTheme;
    applyTheme(theme);
};

const toggleTheme = () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
    updateHeaderHeight();
};

const setActiveButton = (filename) => {
    Array.from(fileList.querySelectorAll("button")).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.file === filename);
    });
};

const updatePager = () => {
    const prevIndex = currentFileIndex - 1;
    const nextIndex = currentFileIndex + 1;

    if (prevIndex >= 0) {
        prevButton.disabled = false;
        prevButton.dataset.target = files[prevIndex];
        prevButton.textContent = `◀ ${formatLabel(files[prevIndex])}`;
    } else {
        prevButton.disabled = true;
        prevButton.dataset.target = "";
        prevButton.textContent = "◀ Start";
    }

    if (nextIndex < files.length) {
        nextButton.disabled = false;
        nextButton.dataset.target = files[nextIndex];
        nextButton.textContent = `${formatLabel(files[nextIndex])} ▶`;
    } else {
        nextButton.disabled = true;
        nextButton.dataset.target = "";
        nextButton.textContent = "End ▶";
    }
};

const filterNavigation = (term) => {
    const query = term.trim().toLowerCase();
    Array.from(fileList.children).forEach((item) => {
        const value = item.dataset.filterValue || "";
        item.style.display = !query || value.includes(query) ? "" : "none";
    });
};

const runHighlighting = () => {
    if (!window.hljs) {
        return;
    }
    content.querySelectorAll("pre code").forEach((block) => window.hljs.highlightElement(block));
};

const renderMarkdown = async (filename) => {
    const index = files.indexOf(filename);
    if (index !== -1) {
        currentFileIndex = index;
        updatePager();
    }
    const requestToken = ++currentRenderToken;
    content.classList.add("is-loading");
    content.setAttribute("aria-busy", "true");
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        const text = await response.text();
        if (requestToken !== currentRenderToken) {
            return;
        }
        content.innerHTML = marked.parse(text);
        enhanceTables();
        setActiveButton(filename);
        runHighlighting();
        requestAnimationFrame(resetScrollPosition);
    } catch (error) {
        if (requestToken === currentRenderToken) {
            content.innerHTML = `<p>Unable to load <code>${filename}</code>.</p>`;
        }
    } finally {
        if (requestToken === currentRenderToken) {
            content.classList.remove("is-loading");
            content.removeAttribute("aria-busy");
        }
    }
};

const buildNav = () => {
    files.forEach((file, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.file = file;
        const label = formatLabel(file);
        button.textContent = label;
        button.addEventListener("click", () => renderMarkdown(file));
        if (index === 0) {
            button.classList.add("active");
        }
        item.dataset.filterValue = label.toLowerCase();
        item.appendChild(button);
        fileList.appendChild(item);
    });
};

const applySidebarWidth = (width) => {
    currentSidebarWidth = width;
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
};

const loadSidebarWidth = () => {
    const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (!stored) {
        return;
    }
    const min = getNumberVar("--sidebar-min-width");
    const max = getNumberVar("--sidebar-max-width");
    const width = clamp(Number.parseFloat(stored), min, max);
    if (!Number.isNaN(width)) {
        applySidebarWidth(width);
    }
};

const stopDragging = () => {
    if (!isDragging) {
        return;
    }
    isDragging = false;
    document.body.classList.remove("resizing");
    divider.classList.remove("dragging");
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(currentSidebarWidth));
};

const handlePointerMove = (event) => {
    if (!isDragging) {
        return;
    }
    const min = getNumberVar("--sidebar-min-width");
    const max = getNumberVar("--sidebar-max-width");
    const width = clamp(event.clientX, min, max);
    applySidebarWidth(width);
};

const setupResize = () => {
    divider.addEventListener("pointerdown", (event) => {
        if (mediaQuery.matches) {
            return;
        }
        isDragging = true;
        divider.classList.add("dragging");
        document.body.classList.add("resizing");
        divider.setPointerCapture(event.pointerId);
        event.preventDefault();
    });

    divider.addEventListener("pointermove", (event) => {
        if (!divider.hasPointerCapture(event.pointerId)) {
            return;
        }
        handlePointerMove(event);
    });

    divider.addEventListener("pointerup", (event) => {
        if (divider.hasPointerCapture(event.pointerId)) {
            divider.releasePointerCapture(event.pointerId);
        }
        stopDragging();
    });

    divider.addEventListener("lostpointercapture", stopDragging);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopDragging);
    window.addEventListener("blur", stopDragging);

    const handleMediaChange = (event) => {
        if (event.matches) {
            stopDragging();
        }
    };
    if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleMediaChange);
    } else if (typeof mediaQuery.addListener === "function") {
        mediaQuery.addListener(handleMediaChange);
    }
};

if (downloadToggle && downloadOptions) {
    downloadToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDownloadMenu();
    });
}

downloadOptionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        const format = button.dataset.format;
        const action = format === "pdf" ? downloadAsPdf : downloadAsPng;
        const promise = withBusyState(button, action);
        if (promise && typeof promise.finally === "function") {
            promise.finally(() => {
                closeDownloadMenu();
                downloadToggle?.focus();
            });
        } else {
            closeDownloadMenu();
            if (downloadToggle) {
                downloadToggle.focus();
            }
        }
    });
});

document.addEventListener("click", (event) => {
    if (!isDownloadMenuOpen) {
        return;
    }
    if (downloadMenuWrapper && downloadMenuWrapper.contains(event.target)) {
        return;
    }
    closeDownloadMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isDownloadMenuOpen) {
        closeDownloadMenu();
        downloadToggle?.focus();
    }
});
themeToggle.addEventListener("click", toggleTheme);
prevButton.addEventListener("click", () => {
    const target = prevButton.dataset.target;
    if (target) {
        renderMarkdown(target);
    }
});
nextButton.addEventListener("click", () => {
    const target = nextButton.dataset.target;
    if (target) {
        renderMarkdown(target);
    }
});
if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        filterNavigation(event.target.value);
    });
}

buildNav();
loadTheme();
loadSidebarWidth();
setupResize();
updateHeaderHeight();
window.addEventListener("resize", updateHeaderHeight);
renderMarkdown(files[0]);
