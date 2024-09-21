<template>
    <div class="grid grid-cols-6 gap-4">
        <Card class="col-span-4 max-lg:col-span-6">
            <slot name="content"></slot>
        </Card>
        <div class="col-span-2 max-lg:col-span-6 max-lg:sticky max-lg:bottom-0">
            <Card class="panel-action-card">
                <div class="action-panel mx-auto">
                    <slot name="action"></slot>
                </div>
            </Card>
        </div>
    </div>

</template>

<script setup>
import Card from '/components/cms/Card.vue';

</script>