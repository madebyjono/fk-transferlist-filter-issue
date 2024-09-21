<template>
  <div class="w-full">
    <FormKit v-if="!loading" ref="allowedStoresForm" type="form" :actions="false">

      <FormKit id="allowed_stores" name="allowed_stores" type="transferlist" source-label="Live/Scheduled Stores"
        target-label="Allowed Stores" target-empty-message="No Stores Selected" :actions="false" :options="options"
        target-searchable searchable selected-icon="checkbox" :customFilter="customFilter">
      </FormKit>

    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import storesData from '@/stores.json';

import { storesData } from '@/stores';
const options = ref([]);
const loading = ref(false);

const customFilter = (option, search) => {
  console.log("Search", search);
  return option.label.toLowerCase().startsWith(search.toLowerCase())
};

async function getData() {
  const res = await fetch(
    'https://142d19fe-7f5c-4bbf-9d9f-9538648560dc.mock.pstmn.io/utility/input-options?name=store_options'
  )
  if (res.ok) {
    const data = await res.json()

    if (data.options) {
      options.value = data.options.map((option) => {
        return {
          value: option.value,
          label: option.label,
        }
      })
    }
  }
  return []
}



onMounted(async () => {
  loading.value = true;
  await getData();
  loading.value = false;
});



</script>

<style>
.formkit-transferlist {
  height: 800px;
}
</style>
