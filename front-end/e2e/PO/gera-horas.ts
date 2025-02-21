export function pegaHoraAleatoriaEntre11e20 () {
    const startHour = 11;
    const endHour = 20;

    const randomHour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const randomMinute = Math.floor(Math.random() * 60);

    return `${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}`;
}

export function pegaHorasForaDoPermitido() {
    const randomBoundary = Math.random() < 0.5;

    if (randomBoundary) {
        const randomHour = Math.floor(Math.random() * 11);
        const randomMinute = Math.floor(Math.random() * 60);
        return `${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}`;
    } else {
        const randomHour = Math.floor(Math.random() * 4) + 20;
        const randomMinute = Math.floor(Math.random() * 60);
        return `${String(randomHour).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}`;
    }
}
