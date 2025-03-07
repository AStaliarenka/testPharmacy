import { KeyboardEvent } from "react"

function isNumberKey(event: KeyboardEvent<HTMLInputElement>) {
    const keyCode = event.code

    if (keyCode.indexOf("Digit") !== -1) {
        return true
    }
    return false
}

function handleIntegerInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const key = event.key

    if (isNumberKey(event)) {
        const prevInputValue = event.currentTarget.value

        if (prevInputValue.length === 0 && key === "0") {
            event.preventDefault()
        }
        else {
            return
        }
    }
    else if (key === "Tab" || key === "Backspace" || key === "Escape" || key === "Delete") {
        return
    }

    event.preventDefault()
}

export {
    handleIntegerInputKeyDown
}
