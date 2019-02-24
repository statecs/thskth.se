export const ths_calendars: {[key: string]: THSCalendar} = {
    events: {
        title:  {
            en: 'Events',
                sv: 'Evenemang'
        },
        calendarId: 'ths.kth.se_uj2mnoprtjqmfkgth7u55tcjvo@group.calendar.google.com',
        color: 'blue',
        calendarName: 'events'
    },
    associations: {
        title:  {
            en: 'Assoications',
                sv: 'Associationer',
        },
        calendarId: 'ths.kth.se_culqlm2b3gpngh3hjckupqqckk@group.calendar.google.com',
        color: 'orange',
        calendarName: 'associations'
    },
    central: {
        title:  {
            en: 'Central',
                sv: 'Central',
        },
        calendarId: 'ths.kth.se_fndkaigtae85f2cg5jstef4mpk@group.calendar.google.com',
        color: 'purple',
        calendarName: 'central'
    },
    chapters: {
        title:  {
            en: 'Chapters',
                sv: 'Sektioner',
        },
        calendarId: 'ths.kth.se_u106rctpt330peusdd39aoctvg@group.calendar.google.com',
        color: 'green',
        calendarName: 'chapters'
    },
    education: {
        title:  {
            en: 'Education',
                sv: 'Utbildning',
        },
        calendarId: 'ths.kth.se_i2s1ls8h5j2id5k342gsmu8m6c@group.calendar.google.com',
        color: 'pink',
        calendarName: 'education'
    },
    future: {
        title:  {
            en: 'Future',
                sv: 'Framtida',
        },
        calendarId: 'ths.kth.se_7h8vg7mk8dug011pp3hgqiup8o@group.calendar.google.com',
        color: 'yellow',
        calendarName: 'future'
    },
    international: {
        title:  {
            en: 'International',
                sv: 'Internationell',
        },
        calendarId: 'ths.kth.se_44cr4o5gflt0th51o45sum9vus@group.calendar.google.com',
        color: 'skyblue',
        calendarName: 'international'
    },
    reception: {
        title:  {
            en: 'Reception',
                sv: 'Mottagning',
        },
        calendarId: 'ths.kth.se_8mu5jbojebdnfta9amovri53dg@group.calendar.google.com',
        color: 'brown',
        calendarName: 'reception'
    }/*,
        {
            title: 'Armada',
            calendarId: 'armada.nu_3evd63ebtffpqkhkivr8d76usk@group.calendar.google.com'
        }*/
};

export interface THSCalendar {
    title: {
        en: string;
        sv: string;
    };
    calendarId: string;
    color: string;
    calendarName: string;
}

