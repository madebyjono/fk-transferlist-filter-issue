<script setup>
import "vue-search-select/dist/VueSearchSelect.css";
import { ModelListSelect } from 'vue-search-select';
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { usePanelStore } from '/stores/cms/panel.js';
import { getHeaderTokens } from "../../utils/cms/getHeaderTokens";
const panelStore = usePanelStore();

const props = defineProps({
    context: Object,
})

const placeholder = computed(() => {
    if (loading.value) {
        return 'Loading Options...';
    } else {
        return 'Select an option';
    }
});

const loading = ref(false);

const getInputOptions = async (loadOptions) => {
    const tokens = await getHeaderTokens();
    const apiBaseUrl = panelStore.apiBaseUrl;
    const response = await fetch(`${apiBaseUrl}/utility/input-options?name=${loadOptions}`, {
        headers: tokens
    });

    return await response.json();
}



let selectedOption = ref(null);
const options = ref([]);

watch(selectedOption, (newVal) => {
    handleSelection(newVal);
});

function handleSelection(value) {
    // Find the selected option
    const selectedOption = options.value.find(option => option.value === value);
    if (!selectedOption) return;

    // set the node value
    props.context._value = selectedOption.value;
    props.context.node.input(selectedOption.value);
}

onMounted(async () => {
    await nextTick();
    if (props.context.node.props.attrs.loadOptions) {
        console.log("Loading searchable select options");
        loading.value = true;
        let data = await getInputOptions(props.context.node.props.attrs.loadOptions);
        console.log(data.options);
        await nextTick();

        // check if node has value as well
        if (props.context.node.value) {
            selectedOption.value = props.context.node.value;
        }

        options.value = data.options;
        loading.value = false;
    }

    else {
        options.value = props.context.node.props.attrs.options;
        if (props.context.value) {
            selectedOption.value = props.context.value.toString();
        }
    }


});

</script>

<template>
    <div>
        <model-list-select :list="options" option-value="value" option-text="label" v-model="selectedOption"
            :id="props.context.node.props.id" :name="props.context.node.name" :isDisabled="loading" :placeholder="placeholder">
        </model-list-select>
    </div>
</template>
