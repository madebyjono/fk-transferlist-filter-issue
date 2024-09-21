<template>
    <div class="panel-action-btn">
        <button :class="['action-btn', colorClass]" @click="$emit('primaryAction')" :disabled="props.loading">
            <span v-if="props.loading" class="loader mr-2"></span>
            <span class="label">
                {{ props.label }}
            </span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: String,
    icon: String,
    loading: Boolean,
    onClick: Function,
    color: {
        type: String,
        default: 'primary'
    }
});

const colorClass = computed(() => `${props.color}-action-btn`);
</script>