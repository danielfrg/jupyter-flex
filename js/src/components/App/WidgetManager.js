// Used by nbconvert mode
// This is another bundle, see webpack
// export { HTMLManager } from "@jupyter-widgets/html-manager";
export { renderWidgets } from "@jupyter-widgets/html-manager/lib/libembed";
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

const WIDGET_MIMETYPE = "application/vnd.jupyter.widget-view+json";

export default class WidgetManager extends HTMLManager {
    onChangeValues = {};

    /**
     * Main entry point to build the widgets to the DOM
     */
    async build_widgets() {
        // Set state
        console.log(this._models);
        await this.load_initial_state();
        await this.load_onchange();

        // Display models
        await this.display_models();
        // console.log(this);
    }

    /**
     * Loads the widget state.
     */
    async load_initial_state() {
        const tags = document.body.querySelectorAll(
            `script[type="${WIDGET_STATE_MIMETYPE}"]`
        );
        for (let stateTag of tags) {
            const widgetState = JSON.parse(stateTag.innerHTML);
            // console.log(widgetState);
            await this.set_state(widgetState);
        }
    }

    /**
     * Loads the onchange state.
     */
    async load_onchange() {
        const onChangeTags = document.body.querySelectorAll(
            `script[type="${WIDGET_ONCHANGE_MIMETYPE}"]`
        );
        for (let i = 0; i != onChangeTags.length; ++i) {
            const tag = onChangeTags[i];
            this.onChangeValues = JSON.parse(tag.innerHTML);
        }
        // console.log(this.onChangeValues);
    }

    async display_models(model_name_filter = "") {
        const viewTags = document.body.querySelectorAll(
            `script[type="${WIDGET_VIEW_MIMETYPE}"]`
        );
        for (let i = 0; i != viewTags.length; ++i) {
            try {
                const viewtag = viewTags[i];
                const widgetViewObject = JSON.parse(viewtag.innerHTML);
                const { model_id } = widgetViewObject;
                const model = await this.get_model(model_id);
                // console.log(model_id);
                // console.log(model);
                if (model_name_filter) {
                    if (model && model.name != model_name_filter) {
                        continue;
                    }
                }
                const widgetEl = document.createElement("div");
                if (model && viewtag && viewtag.parentElement) {
                    // console.log(model_id);
                    // console.log(model);
                    viewtag.parentElement.insertBefore(widgetEl, viewtag);
                    let dommodel = model;
                    const view = await this.create_view(dommodel);
                    // console.log("View");
                    // console.log(view);
                    await this.display_view(view, widgetEl);

                    view.listenTo(view.model, "change", () => {
                        this.onWidgetChange(view.model);
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    /**
     * Handles the state update
     * It will trigger the update of the Widget Views.
     */
    async onWidgetChange(model) {
        const { model_id } = model;
        const state = await this.get_state();
        const onChange = this.onChangeValues["onchange"];

        for (let output_id in onChange) {
            // console.log("----");
            // console.log("Output ID:");
            // console.log(output_id);
            const output_onchange_data = onChange[output_id];
            const affected_by_ids = output_onchange_data["affected_by"];
            const output_model = state["state"][output_id]["state"];

            if (!affected_by_ids.includes(model_id)) {
                // Only update if this output is affected by the widget
                // console.log("Ignored");
                continue;
            }

            // Iterat inputs and get the values to make the has
            let inputs = [];
            for (let input_id of affected_by_ids) {
                const input_model = state["state"][input_id]["state"];
                // console.log("Input ID:");
                // console.log(input_id);
                const key = this.getWidgetValueKey(input_model["_model_name"]);
                let input_value = input_model[key];
                // console.log("Input/index Value:");
                // console.log(input_value);

                if (input_value !== undefined) {
                    // Ints and Booleans
                    if (
                        typeof input_value === "number" ||
                        typeof input_value === "boolean"
                    ) {
                        inputs.push(input_value);
                    } else if (input_value instanceof Array) {
                        // IntRangeSlider
                        inputs.push(`[${input_value.toString()}]`);
                    }
                }
            }

            // console.log("Inputs final:");
            // console.log(inputs);
            let hash = this.hash_fn(inputs);
            console.log("Hash:");
            console.log(hash);

            const output_value = output_onchange_data["values"][hash];
            console.log("Output value");
            console.log(output_value);
            if (output_value !== undefined) {
                const key = this.getWidgetValueKey(output_model["_model_name"]);
                state["state"][output_id]["state"][key] = output_value;
                // await this.get_state();

                // clear_state() {
                await resolvePromisesDict(this._models).then((models) => {
                    Object.keys(models).forEach((id) => {
                        // (models as any)[id].close();
                        // this._models = Object.create(null);

                        let model = models[id];
                        if (model.name == "OutputModel") {
                            models[id].close();
                            this._models[model.model_id] = null;

                            // console.log(id);
                            // const modelCreate = {
                            //     model_id: model.model_id,
                            //     model_name: model.name,
                            //     model_module: model.module,
                            //     model_module_version:
                            //         model.attributes._model_module_version,
                            // };
                            // console.log(modelCreate);

                            // const modelState =
                            //     state["state"][output_id]["state"];

                            // const modelPromise = this.new_model(
                            //     modelCreate,
                            //     modelState
                            // );
                            // this._models[model.model_id] = modelPromise;
                        }
                    });
                });

                // console.log(this._models);
                // this._models[
                //     "a3b8fd18b4bc4ee2bc73cbcdc514cce7"
                // ] = Object.create(null);
                // console.log(this._models);
                await this.set_state(state);
                this.display_models("OutputModel");
            }
        }
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
