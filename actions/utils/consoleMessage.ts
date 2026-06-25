export const printConsoleMessage = () => {
    if (typeof window === "undefined") return;

    const servicedApartmentsLogoAscii = `
■ ■ ■   ■ ■ ■   ■ ■ ■
■ ■ ■   ■ ■ ■   ■ ■ ■
■ ■ ■   ■ ■ ■   ■ ■ ■

■ ■ ■   ■ ■ ■   ■ ■ ■
■ ■ ■   ■ ■ ■   ■ ■ ■
■ ■ ■   ■ ■ ■   ■ ■ ■

■ ■ ■   ■ ■ ■   ■ ■ ■
■ ■ ■   ■ ■ ■   ■ ■ ■
■ ■ ■   ■ ■ ■   ■ ■ ■
`;

    console.log(
        `%c${servicedApartmentsLogoAscii}\n\n%cDiscover places that are efficient, reliable, and truly feel like home. %chttps://servicedapartments.lk/`,
        "color: #FF5A5F; font-size: 12px; font-weight: bold;",
        "color: #fff; font-size: 14px;",
        "color: #FF5A5F; font-size: 14px; text-decoration: underline;"
    );
};