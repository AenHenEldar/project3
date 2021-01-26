function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    const tabsParent = document.querySelector(tabsParentSelector),
          tabs = document.querySelectorAll(tabsSelector),
          tabsContent = document.querySelectorAll(tabsContentSelector);
          

    function hideTabContent() {
        tabsContent.forEach((value, i) => {
            value.classList.add('hide');
            value.classList.remove('show', 'fade');
            tabs[i].classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', e => {
        const target = e.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((value, i) => {
                if(value === target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

export default tabs;