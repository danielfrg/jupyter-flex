export { requireLoader as embedRequireLoader } from "@jupyter-widgets/html-manager/lib/libembed-amd";

import { HTMLManager } from "@jupyter-widgets/html-manager";

import Papa from "papaparse";
import { resolvePromisesDict } from "@jupyter-widgets/base";

const WIDGET_STATE_MIMETYPE = "application/vnd.jupyter.widget-state+json";
const WIDGET_VIEW_MIMETYPE = "application/vnd.jupyter.widget-view+json";
const WIDGET_ONCHANGE_MIMETYPE =
    "application/vnd.illusionist.widget-onchange+json";

const NUMERIC_WIDGETS = [
    "IntSliderModel",
    "FloatSlider",
    "FloatLogSlider",
    "IntRangeSliderModel",
    "FloatRangeSlider",
    "BoundedIntTextModel",
    "BoundedFloatText",
    "IntText",
    "FloatText",
    "IntProgressModel",
    "FloatProgressModel",
];

const BOOLEAN_WIDGETS = ["ToggleButtonModel", "CheckboxModel", "ValidModel"];

const SELECTION_WIDGETS = [
    "DropdownModel",
    "RadioButtonsModel",
    "SelectModel",
    "SelectionSliderModel",
    "SelectionRangeSliderModel",
    "ToggleButtonsModel",
    "SelectMultipleModel",
];

const STRING_WIDGETS = [
    "TextModel",
    "TextAreaModel",
    "LabelModel",
    "HTMModelL",
    "HTMLMathModel",
    "ImageModel",
];

export default class WidgetManager extends HTMLManager {
    onChangeState = {};

    async load_states() {
        await this.load_initial_state();
        await this.load_onchange_state();
    }

    /**
     * Loads the widget initial state
     */
    async load_initial_state() {
        const tags = document.body.querySelectorAll(
            `script[type="${WIDGET_STATE_MIMETYPE}"]`
        );
        for (let stateTag of tags) {
            const widgetState = JSON.parse(stateTag.innerHTML);
            // console.log("Init state");
            // console.log(widgetState);
            await this.set_state(widgetState);
        }
    }

    /**
     * Loads the onChange widget state
     */
    async load_onchange_state() {
        const onChangeTags = document.body.querySelectorAll(
            `script[type="${WIDGET_ONCHANGE_MIMETYPE}"]`
        );
        for (let tag of onChangeTags) {
            this.onChangeState = JSON.parse(tag.innerHTML);
        }
        // console.log("onChange state");
        // console.log(this.onChangeState);

        this.widgetAffects = {};

        this.onChangeState.control_widgets.forEach((controlId) => {
            this.widgetAffects[controlId] = [];
            for (let [outputId, obj] of Object.entries(
                this.onChangeState.onchange
            )) {
                if (obj.affected_by.includes(controlId)) {
                    // console.log(`${controlId} + ${outputId}: ${obj}`);
                    this.widgetAffects[controlId].push(outputId);
                }
            }
        });

        // console.log("WidgetAffects");
        // console.log(this.widgetAffects);
    }

    /*
     * Render one widgetd based on a ModelId
     */
    async renderWidget(modelId) {
        const viewEl = document.body.querySelector(`div[id="${modelId}"]`);
        const model = await this.get_model(modelId);

        const view = await this.create_view(model);

        // TODO: only add listeners to enabled widgets
        // (the ones on the onChange[controls] list )
        view.listenTo(model, "change", () => {
            this.onWidgetChange(modelId);
        });
        await this.display_view(view, viewEl);
    }

    /**
     * Build all the widgets
     */
    async renderAllWidgets() {
        const viewTags = document.body.querySelectorAll(
            `script[type="${WIDGET_VIEW_MIMETYPE}"]`
        );
        viewTags.forEach(async (viewtag) => {
            try {
                const widgetViewObject = JSON.parse(viewtag.innerHTML);
                const { model_id } = widgetViewObject;
                await this.renderWidget(model_id);
            } catch (error) {
                console.error(error);
            }
        });
    }

    /**
     * Handles the state update
     * It will trigger the update of the Widget Views.
     */
    async onWidgetChange(modelId) {
        // console.log("onWidgetChange");
        // console.log(modelId);
        let state = await this.get_state();
        const onChange = this.onChangeState["onchange"];

        const outputsAffected = this.widgetAffects[modelId];

        if (!outputsAffected) {
            return;
        }

        outputsAffected.forEach(async (outputId) => {
            const outputModel = state["state"][outputId]["state"];
            const outputOnChangeData = onChange[outputId];
            const outputAffectedBy = outputOnChangeData["affected_by"];

            // console.log("Affected by:");
            // console.log(outputAffectedBy);

            // 1. Iterate controlValues and get the values to make the has
            let controlValues = [];
            for (let controlId of outputAffectedBy) {
                const inputModel = state["state"][controlId]["state"];
                // console.log("Input ID:");
                // console.log(controlId);
                const key = this.getWidgetValueKey(inputModel["_model_name"]);
                let inputValue = inputModel[key];
                // console.log("Input/index Value:");
                // console.log(inputValue);

                if (inputValue !== undefined) {
                    if (inputValue instanceof Array) {
                        // IntRangeSlider
                        controlValues.push(`[${inputValue.toString()}]`);
                    } else {
                        controlValues.push(inputValue);
                    }
                }
            }

            // 2. Make hash based on the controlValues
            let hash = this.hash_fn(controlValues);
            // console.log("Hash:");
            // console.log(hash);

            // 3. Update affected widgets
            const outputValue = outputOnChangeData["values"][hash];
            // console.log("Output value");
            // console.log(outputValue);
            if (outputValue !== undefined) {
                const key = this.getWidgetValueKey(outputModel["_model_name"]);
                state["state"][outputId]["state"][key] = outputValue;

                // If its an OutputModel clear the state
                // This avoids objects being outputed multiple times
                // based on this.clear_state()
                await resolvePromisesDict(this._models).then((models) => {
                    Object.keys(models).forEach((id) => {
                        let model = models[id];
                        if (model.name == "OutputModel") {
                            models[id].close();
                            this._models[model.model_id] = null;
                        }
                    });
                });

                await this.set_state(state);
                if (outputModel["_model_name"] == "OuptuModel") {
                    this.renderWidget(outputId);
                }
                // this.display_models("OutputModel");
            }
        });
    }

    getWidgetValueKey(model_name) {
        if (SELECTION_WIDGETS.includes(model_name)) {
            return "index";
        } else if (model_name == "OutputModel") {
            return "outputs";
        }
        return "value";
    }

    hash_fn(inputs) {
        let quotes = [];
        for (let input of inputs) {
            if (typeof input === "number") {
                quotes.push(false);
            } else {
                quotes.push(true);
            }
        }
        // console.log("quotes:");
        // console.log(quotes);

        var results = Papa.unparse([inputs], {
            quotes: quotes,
            quoteChar: '"',
        });
        return results;
    }
}
