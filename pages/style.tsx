import React, { CSSProperties } from "react";

const styles = {
    verticalFlex: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    } as CSSProperties,
    horizontalFlex: {
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "center"
    } as CSSProperties,
    p10: {
        padding: 10
    } as CSSProperties,
    hr: {
        border: "solid 1px #888",
        width: "80%",
        // color: "#FFFF00",
        height: "0px"
    } as CSSProperties,
    link: {
        color: !global.dark ? '#ff8' : 'default'
    } as CSSProperties,
    main: {
        backgroundColor: !global.dark ? '#224' : 'default',
        color: !global.dark ? 'white' : 'default'
    }
}

export default styles

export const randomColor = () => {
    if (!global.debug) {
        if (global.dark) return '#2240'
        return '#fff0';
    }
    const r = Math.floor(Math.random() * 8)
    const g = Math.floor(Math.random() * 8)
    const b = Math.floor(Math.random() * 8)
    const code: Number = r * 16 * 16 + g * 16 + b + (!!global.dark ? 0 : 2184)
    return '#' + code.toString(16)
}