<template>
  <div class="w-full">
    <FormKit ref="allowedStoresForm" type="form" :actions="false" >

      <FormKit id="allowed_stores" name="allowed_stores" type="transferlist" source-label="Live/Scheduled Stores"
        target-label="Allowed Stores" target-empty-message="No Stores Selected" :actions="false"
        :options="options" target-searchable searchable selected-icon="checkbox"
        :customFilter="customFilter"
        >
      </FormKit>

    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import storesData from '@/stores.json';

import { storesData } from '@/stores';
const options = ref([]);

const customFilter = (option, search) => {
  return option.label.toLowerCase().startsWith(search.toLowerCase())
};


onMounted(async () => {
  options.value = storesData;
  
});

</script>

<style>
.formkit-transferlist {
 height: 800px;
}
</style>
