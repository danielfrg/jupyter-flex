import { HTMLManager } from "@jupyter-widgets/html-manager";
import { resolvePromisesDict } from "@jupyter-widgets/base";
import Papa from "papaparse";

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
    onChangeState = null;

    async loadState() {
        await this.loadInitialState();
        await this.loadOnChangeState();
    }

    /**
     * Loads the widget initial state
     */
    async loadInitialState() {
        const stateTags = document.body.querySelectorAll(
            `script[type="${WIDGET_STATE_MIMETYPE}"]`
        );
        if (stateTags.length == 0) {
            console.log("Jupyter-flex: Didn't find widget state");
            return;
        }
        for (let stateTag of stateTags) {
            const widgetState = JSON.parse(stateTag.innerHTML);
            await this.set_state(widgetState);
        }
    }

    /**
     * Loads the onChange widget state
     */
    async loadOnChangeState() {
        const onChangeTags = document.body.querySelectorAll(
            `script[type="${WIDGET_ONCHANGE_MIMETYPE}"]`
        );
        if (onChangeTags.length == 0) {
            return;
        }
        for (let tag of onChangeTags) {
            this.onChangeState = JSON.parse(tag.innerHTML);
        }
        this.widgetAffects = {};

        this.onChangeState.control_widgets.forEach((controlId) => {
            this.widgetAffects[controlId] = [];
            for (let [outputId, obj] of Object.entries(
                this.onChangeState.onchange
            )) {
                if (obj.affected_by.includes(controlId)) {
                    this.widgetAffects[controlId].push(outputId);
                }
            }
        });
    }

    /*
     * Render one widgetd based on a ModelId
     */
    async renderWidget(modelId) {
        const viewEl = document.body.querySelector(`div[id="${modelId}"]`);
        const model = await this.get_model(modelId);
        const view = await this.create_view(model);

        viewEl.innerHTML = "";
        await this.display_view(view, viewEl);

        if (this.onChangeState) {
            if (this.onChangeState.control_widgets.includes(modelId)) {
                // If its on the list of control widgets add the listener
                view.listenTo(model, "change", () => {
                    this.onWidgetChange(modelId);
                });
            }
        }
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
                const key = this.getWidgetValueKey(inputModel["_model_name"]);
                let inputValue = inputModel[key];

                if (inputValue !== undefined) {
                    if (inputValue instanceof Array) {
                        controlValues.push(`[${inputValue.toString()}]`);
                    } else {
                        controlValues.push(inputValue);
                    }
                }
            }

            // 2. Make hash based on the controlValues
            let hash = this.hash_fn(controlValues);

            // 3. Update affected widgets
            const outputValue = outputOnChangeData["values"][hash];
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

        var results = Papa.unparse([inputs], {
            quotes: quotes,
            quoteChar: '"',
        });
        return results;
    }
}
