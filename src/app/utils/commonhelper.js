define(['ojs/ojcore', 'moment'
], function (oj, moment) {
    'use strict';

    function CommonHelper() {
        
        var self = this;

        function init() {
            // place an init function here
        }

        // Internet explorer version 6-11                                                 
        self.isIE = /*@cc_on!@*/false || !!document.documentMode;

        self.emailRegExpPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$';

        /**
         * Is given XHR status is successful?
         * @param  {Number}  xhrStatus XHR status code
         * @return {Boolean}
         */
        self.isXhrSuccessful = function (xhrStatus) {
            return ((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus === 304);
        };

        /**
         * Format date for display.
         * @param  {string} dateStr date in string format
         * @param  {string} format format to output
         * @return {string} formatted date string
         */
        self.formatDate = function (dateStr, format) {
            if (dateStr)
                return moment(new Date(dateStr)).format(format);
            else
                return 'N/A';
        };
        
        /**
         * Format hours and minutes values as a time format e.g. "01:20".
         * @param  {string} hours 
         * @param  {string} minutes
         * @return {string} formatted time string
         */
        self.formatTime = function (hours, minutes) {
            if (hours && minutes)
                return hours + ':' + minutes;
            else
                return null;
        };

        /**
         * Date Range Checker
         * @param {type} dataDate
         * @param {type} fromDate
         * @param {type} toDate
         * @returns {unresolved}
         */
        self.isDateInRange = function (dataDate, fromDate, toDate) {
            var dd = moment(dataDate);
            var sd = moment(fromDate);
            var ed = moment(toDate);
            return dd.isBetween(sd, ed);
        };
        
        /** 
         * Check if a provided date is in the past comapred to the sys date
         * @param {string} date
         * @returns {Boolean}
         */
        self.checkPast = function (date) {
            if (new Date(date) < new Date()) {
                return true;
            } else {
                return false;
            }
        };
        
        /**
         * Return the duration difference as a time format e.g. 13:00 - 14:00 = 01:00
         * @param {string} start date string
         * @param {string} end date string
         * @returns {string} date in 'HH:mm' format
         */
        self.grossChangeDuration = function (start, end) {
            var difference = new Date(new Date(end) - new Date(start));
            return moment(difference).format('HH:mm');
        };

        self.getTimeDiffAsObj = function (startStr, endStr) {
            if (startStr && endStr) {
                var msec = new Date(endStr) - new Date(startStr);
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                msec -= mm * 1000 * 60;
                return {'hours': hh, 'minutes': mm};
            } else
                return {'hours': '00', 'minutes': '00'};
        };
        
        /**
         * Takes a string of a time in formats as below and outputs this as a minutes value
         * e.g. "01:30" outputs 90
         * @param {string} duration in format "00:00" || "0:0"
         * @returns {number} 
         */
        self.timeAsMinutes = function (time) {
            if (time) {
                var hours = parseInt(time.split(':')[0]),
                        minutes = parseInt(time.split(':')[1]);
                while (hours >= 1) {
                    hours = hours - 1;
                    minutes = minutes + 60;
                }
                return Number(minutes);
            } else {
                return null;
            }
        };

        /**
         * Takes two times in formats as below and outputs this as a minutes duration of the difference value
         * e.g. "01:30", "02:30" outputs 60
         * @param {string} firstTime in format "00:00" || "0:0"
         * @param {string} secondTime in format "00:00" || "0:0"
         * @param {string} breakDuration in minutes
         * @returns {number} 
         */
        self.durationAsMinutes = function (firstTime, secondTime, breakDuration) {
            if (firstTime && secondTime) {
                var start = firstTime.split(":");
                var end = secondTime.split(":");
                var endTimeInMins = (Number(end[0]) * 60) + Number(end[1]);
                var startTimeInMins = (Number(start[0]) * 60) + Number(start[1]);
                var breakMinutes = 0;
                if (breakDuration)
                    breakMinutes = breakDuration;
                var timeDiffInMins = endTimeInMins - startTimeInMins - breakMinutes;
                if (endTimeInMins < startTimeInMins) {
                    timeDiffInMins += (24 * 60);
                }
                return timeDiffInMins;
            } else {
                return null;
            }
        };

        /**
         * Format a time as hours and minutes string
         * i.e "01:05" as 1hrs 5mins
         * @param  {string} time value for a shifts duration format '00:00'
         * @return {string} return 'N/A' string if duration is not truthy
         * @return {string} return '1hrs 10mins' format string if hours and minutes exist
         * @return {string} return '10mins' string if only minutes exist
         * @return {string} return '1hrs' string if only hours exist
         * @return {string} return 'N/A' string if duration is not a valid format or value
         */
        self.formattedTime = function (time) {
            //return 'N/A' string if there is no given shift duration
            if (!time)
                return 'N/A';
            //Check the values of the duration split on ':'
            if (parseInt(time.split(':')[0]) > 0 && parseInt(time.split(':')[1]) > 0) {
                //Hours and minutes exist for duration
                return parseInt(time.split(':')[0]) + 'h' + (' ') + parseInt(time.split(':')[1]) + 'm';
            } else if (parseInt(time.split(':')[0]) === 0 && parseInt(time.split(':')[1]) > 0) {
                //Minutes only exist for duration
                return parseInt(time.split(':')[1]) + 'm';
            } else if (parseInt(time.split(':')[0]) > 0 && parseInt(time.split(':')[1]) === 0) {
                //Hours only exist for duration
                return parseInt(time.split(':')[0]) + 'h';
            } else {
                //Handle an unexpected format or '00:00' exception with 'N/A' string
                return 'N/A';
            }
        };

        /**
         * Format a startTime, endTime, and any breaks as a gross string
         * i.e "12:00", "14:00", "00:30", as 2hrs 30mins
         * @param  {string} startTime value for a shifts start time format '00:00'
         * @param  {string} endTime value for a shifts end time format '00:00'
         * @param  {string} breakValue value for a shifts break format '00:00'
         * @return {string} return 'N/A' string if duration is not truthy
         * @return {string} return '10mins' string if only minutes exist
         * @return {string} return '1hrs' string if only hours exist
         * @return {string} return '1hrs 10mins' format string if hours and minutes exist
         */
        self.formattedGrossDuration = function (startTime, endTime, breakValue) {
            // Check both time values exists else return 'N/A'
            if (!startTime || !endTime)
                return self.lng_na;
            // Get total minutes values for the start and end times
            var startTimeInMins = (Number(startTime.split(":")[0]) * 60) + Number(startTime.split(":")[1]);
            var endTimeInMins = (Number(endTime.split(":")[0]) * 60) + Number(endTime.split(":")[1]);
            // Set an initial value for break minutes
            var breakMinutes = 0;
            // If a break value exists, get the value as minutes
            if (breakValue) {
                var breakMinutes = (Number(breakValue.split(":")[0]) * 60) + Number(breakValue.split(":")[1]);
            }
            // Work the total time in minutes from all values
            var timeDiffInMins = endTimeInMins - startTimeInMins - breakMinutes;
            if (endTimeInMins < startTimeInMins) {
                timeDiffInMins += (24 * 60);
            }
            // Get the total hours of the minutes duration
            var grossDurationHrs = parseInt(timeDiffInMins / 60);
            // Get the remaining minutes
            var grossDurationMins = timeDiffInMins % 60;
            // Return the duration string based on the output of the above
            if (grossDurationHrs < 1) {
                // Only minutes exist
                return grossDurationMins + 'm';
            } else if (grossDurationMins < 1) {
                // Only hours exist
                return grossDurationHrs + 'h';
            } else {
                // Minutes and hours exist
                return grossDurationHrs + 'h' + (' ') + grossDurationMins + 'm';
            }
        };

        /**
         * Format a startTime, endTime, and any breaks as a gross string
         * i.e "12:00", "14:00", "00:30", as 2hrs 30mins
         * @param  {string} scheduleStart value for a shifts start time format '00:00'
         * @param  {string} actualStart value for a shifts end time format '00:00'
         * @param  {string} scheduleEnd value for a shifts start time format '00:00'
         * @param  {string} actualEnd value for a shifts end time format '00:00'
         * @return {string} '1h 10m' format string
         */
        self.formattedDurationVariation = function (scheduleStart, actualStart, scheduleEnd, actualEnd) {
            // Get the two variations durations by working a diff nad then fetching the minutes
            var scheduledDuration = moment.duration(moment(moment(scheduleEnd).diff(moment(scheduleStart))).format("HH:mm")).asMinutes();
            var actualDuration = moment.duration(moment(moment(actualEnd).diff(moment(actualStart))).format("HH:mm")).asMinutes();
            var timeDiffInMins;
            // Work the larger of the two and then subtract to get the difference
            if (scheduledDuration > actualDuration) {
                timeDiffInMins = scheduledDuration - actualDuration;
            } else if (scheduledDuration < actualDuration) {
                timeDiffInMins = actualDuration - scheduledDuration;
            } else {
                timeDiffInMins = 0;
            }
            // Return the diff as a string format
            var grossDurationHrs = parseInt(timeDiffInMins / 60);
            var grossDurationMins = timeDiffInMins % 60;
            if (grossDurationHrs < 1) {
                if (scheduledDuration > actualDuration)
                    return ('-') + grossDurationMins + 'm';
                return grossDurationMins + 'm';
            } else if (grossDurationMins < 1) {
                if (scheduledDuration > actualDuration)
                    return ('-') + grossDurationHrs + 'h';
                return grossDurationHrs + 'h';
            } else {
                if (scheduledDuration > actualDuration)
                    return ('-') + grossDurationHrs + 'h' + (' ') + grossDurationMins + 'm';
                return grossDurationHrs + 'h' + (' ') + grossDurationMins + 'm';
            }
        };

        self.isNullOrEmpty = function (value) {
            return value === null || value === '';
        };

        self.emptyIfNull = function (value) {
            return value === null ? '' : value;
        };

        /**
         * Function to set sessionStorage attributes
         * @param {type} key
         * @param {type} attrVal
         */
        self.setSessionAttr = function (key, attrVal) {
            sessionStorage.setItem(key, attrVal);
        };

        /**
         * Function to retrieve sessionStorage attributes
         * @param {type} key
         */
        self.getSessionAttr = function (key) {
            return sessionStorage.getItem(key);
        };

        /**
         * Function to remove a session storage attribute
         * @param {type} key
         */
        self.removeSessionAttr = function (key) {
            sessionStorage.removeItem(key);
        };

        /**
         * Retrieves the store details
         * @param {type} key
         */
        self.getStoreDetail = function (key) {
            var storeDetails = JSON.parse(self.getSessionAttr('tesco.storeDetails'));
            return storeDetails[0][key];
        };

        self.getCookie = function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        };

        /**
         * Retrieves a DateTime object in the UTC format based on the original local Date settings
         * @param {type} localDate
         * @param {type} localTime
         * @param {type} includeTimeZone
         */
        //this function is known to cause issues with date formatting in safari
        self.getUTCDateTime = function (localDate, localTime, includeTimeZone) {
            var dateTime = new Date(moment(localDate + ' ' + localTime, 'YYYY-MM-DD HH:mm').toDate());
            var utcDateTime = dateTime.toUTCString();
            var isoDateTime = new Date(utcDateTime).toISOString();
            return includeTimeZone ? isoDateTime.replace('.000Z', '.000+00:00') : isoDateTime.replace('.000Z', '');
        };

        /**
         * Retrieves a DateTime object in the UTC format based on the original local Date settings
         * @param {type} localDate
         * @param {type} includeTimeZone
         */
        //this function is known to cause issues with date formatting in safari
        self.getUTCDate = function (localDate, includeTimeZone) {
            var localDateTime = new Date(localDate);
            var utcDateTime = localDateTime.toUTCString();
            var isoDateTime = new Date(utcDateTime).toISOString();
            return includeTimeZone ? isoDateTime.replace('.000Z', '.000+00:00') : isoDateTime.replace('.000Z', '');
        };

        // Returns the application's context root
        self.getAppContextRoot = function () {
            var pathName = window.location.pathname;
            return pathName.split('/')[1];
        };

        init();
    }

    return new CommonHelper();
});
