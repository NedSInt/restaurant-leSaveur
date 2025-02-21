export function pegaProximoDiaDeSemana() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    let daysToAdd;
    if (dayOfWeek <= 4) {
        daysToAdd = 4 - dayOfWeek;
    } else if (dayOfWeek === 5) {
        daysToAdd = 1;
    } else {
        daysToAdd = 6 - dayOfWeek + 4;
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate.toISOString().split('T')[0];
}

export function pegaProximaQuintaOuSexta() {
    const today = new Date();

    while (today.getDay() !== 4 && today.getDay() !== 5) {
        today.setDate(today.getDate() + 1);
    }

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function pegaDataEntreSegundaEQuarta(): string {
    const today = new Date();
    const randomDate = new Date();

    randomDate.setDate(today.getDate() + 1);

    const validDays: Date[] = [];

    for (let i = 0; i < 7; i++) {
        const dayOfWeek = randomDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 3) {
            validDays.push(new Date(randomDate));
        }
        randomDate.setDate(randomDate.getDate() + 1);
    }

    const randomIndex = Math.floor(Math.random() * validDays.length);
    const selectedDate = validDays[randomIndex];

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}



export function pegaProximoDiaFinalDeSemana() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const daysToAdd = dayOfWeek <= 5 ? 6 - dayOfWeek : 0;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate.toISOString().split('T')[0];
}

export function pegaDatasAleatoriaEntreQuintaEDomingo() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const daysToThursday = dayOfWeek <= 4 ? 4 - dayOfWeek : 11 - dayOfWeek;

    const randomOffset = Math.floor(Math.random() * 4);

    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() + daysToThursday + randomOffset);

    return randomDate.toISOString().split('T')[0];
}


