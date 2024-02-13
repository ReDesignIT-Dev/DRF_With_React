import { useReducer } from "react";

export function Checkbox() {
    const [checked, setChecked] = useReducer(
        (checked) => !checked,
        false
    );
    return (
        <>
            <label htmlFor="my-checkbox">
                {checked ? "checked" : "not checked"}
            </label>
            <input
                id="my-checkbox"
                type="checkbox"
                value={checked}
                onChange={setChecked}
            />
        </>
    )
}