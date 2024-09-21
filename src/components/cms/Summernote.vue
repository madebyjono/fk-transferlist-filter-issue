<template>
    <textarea :id="props.context.node.props.id" :name="props.context.node.name"></textarea>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import { getHeaderTokens } from '/utils/cms/getHeaderTokens';
// import $ from 'jquery';
// import 'summernote/dist/summernote-lite.css';
// import 'summernote/dist/summernote-lite.js';
import { usePanelStore } from '/stores/cms/panel.js';

const panelStore = usePanelStore();

const props = defineProps({
    context: Object,
})

const createImgNode = (src) => {
    const imgNode = document.createElement('img');
    imgNode.src = src;
    return imgNode;
}

const config = {
    height: 150,
    dialogsInBody: false,
    disableDragAndDrop: true,
    toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link', 'picture']],
        ['table', ['table']],
    ],

    callbacks: {
        onChange: function (contents, $editable) {
            props.context.node.input(contents)
        },
        onInit: async function () {
            await nextTick();
            await nextTick();
            await nextTick();
            console.log("Init summernote")
            console.log("node value", props.context.node.value);
            if (props.context.node.value) {
                console.log("Set value for summernote with id: ", props.context.node.props.id)
                console.log("value to set: ", props.context.node.value)

                $(`#${props.context.node.props.id}`).summernote('code', props.context.node.value);
            }
        },
        onPaste: function (e) {
          const bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
          e.preventDefault();
          setTimeout(function () {
            document.execCommand('insertText', false, bufferText);
          }, 10)
        },
        onImageUpload: async function (files) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                const uniqueKey = `file[${i}]`;
                formData.append(uniqueKey, files[i]);
            }

            // Set form_id in formdata
            formData.append('form_id', panelStore.formId);

            // Set Field Name in formdata
            formData.append('field_name', props.context.node.name);

            //console.log each formData key value
            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            const tokens = await getHeaderTokens();
            const response = await fetch(`${panelStore.apiBaseUrl}/utility/upload-rich-content-file`, {
                method: 'POST',
                headers: tokens,
                body: formData
            });

            if (!response.ok) {
                console.error('Summernote upload failed');
                alert('There was an error uploading the image.');
                return;
            }

            const data = await response.json();
            console.log("Uploaded image urls", data.urls);
            for (const url of data.urls) {
                const imgNode = createImgNode(url.url);
                $(`#${props.context.node.props.id}`).summernote('insertNode', imgNode);
            }
        }

    }

}

onMounted(async () => {
    await nextTick();
    console.log(props.context.node);

    $(`#${props.context.node.props.id}`).summernote(config);
});

</script>

<style scoped>
.note-toolbar {
    background-color: #F7F8FA !important;
}
</style>