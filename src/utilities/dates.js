

export default class DatesUtilities {

    constructor() {}

    static isDate = d => d instanceof Date && !isNaN(d)

    static getMonthName(d) {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]

        return monthNames[d.getMonth()]

    }

}