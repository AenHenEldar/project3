function getZero(num) {
    if(num < 10) {
        return `0${num}`;
    } 
    return num;
}

function timer(id, deadline) {

    function setTimeReminder(endtime) {
        const total = new Date(endtime) - new Date(),
        seconds = Math.floor( (total/1000) % 60 ),
        minutes = Math.floor( (total/1000/60) % 60 ),
        hours = Math.floor( (total/(1000*60*60)) % 24 ),
        days = Math.floor( total/(1000*60*60*24) );

        return {
            total,
            seconds,
            minutes,
            hours,
            days
        };
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(updateTime, 1000);

        updateTime();

        function updateTime() {
            const t = setTimeReminder(endtime);

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(id, deadline);  
}

export default timer;
export {getZero};