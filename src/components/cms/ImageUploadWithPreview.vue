<script setup>
import { onMounted, ref } from 'vue';
import { usePanelStore } from '/stores/cms/panel.js';
import { getHeaderTokens } from '../../utils/cms/getHeaderTokens';
import { error } from 'jquery';
const panelStore = usePanelStore();

const props = defineProps({
    context: Object,
})


const uploading = ref(false);
const fileName = ref('');
const previewUrl = ref(null);
const imgInput = ref(null);
const errorMsg = ref('');

const handleFileChange = async (node) => {
    node.on('settled:blocking', async () => {
        try {
            errorMsg.value = '';
            if (node.value.length < 1) {
                return;
            }
            console.log("Validation passed, begin upload");
            console.log("Node value ", node)
            if (node.value[0].url) {
                previewUrl.value = node.value[0].url;
                return;
            }
            const file = node.value[0].file;

            console.log("File", file);

            fileName.value = file.name;

            uploading.value = true;
            const formData = new FormData();

            // Set File 
            formData.append('file[0]', file);

            // Set form_id in formdata
            formData.append('form_id', panelStore.formId);

            // Set Field Name in formdata
            formData.append('field_name', props.context.node.name);

            //console.log each formData key value
            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            let baseUrl;

            // if (import.meta.env.DEV) {
            //     baseUrl = 'http://13.250.246.147/rdm_api/web'
            // } else {
                baseUrl = panelStore.apiBaseUrl;
            // }

            const response = await fetch(`${baseUrl}/utility/upload`, {
                headers: await getHeaderTokens(),
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                console.error('Upload failed');
                uploading.value = false;
                errorMsg.value = 'An error occurred while uploading the image: ' + response.status + ' ' + response.statusText;
                return;
            }

            const data = await response.json();

            console.log("Uploaded image urls", data.urls);
            
            // check if intinial file uploaded is a video, set a placeholder image 
            if (file.name.includes('.mp4')) {
                previewUrl.value = '/img/media/cms-content-video-file-placeholder.jpg';
            } else {
                previewUrl.value = data.urls[0].url;
            }

            const newInputValue = [{
                "name": file.name,
                "url": data.urls[0].url,
                "path": data.urls[0].path
            }];

            await props.context.node.input(newInputValue);

            uploading.value = false;
        } catch (error) {
            console.log("Upload error");
            console.error(error);
            errorMsg.value = 'An error occurred while uploading the image';
            uploading.value = false;
        }
    });

};


onMounted(() => {
    console.log(props.context.node);
});
</script>

<template>
    <div class="iuwp-container flex items-start w-1/5 mr-5">
        <div :class="['img-preview-container', 'mr-4', props.context.node.props.attrs.orientation]">
            <span v-if="!previewUrl" class="img-loader mx-auto border" :class="{ 'is-uploading': uploading }"></span>
            <img v-else :class="props.context.node.props.attrs.orientation" :src="previewUrl" alt="Image Preview"
                class="img-preview" />
        </div>
        <div class="input-container w-4/5">
            <FormKit type="file" :id="props.context.node.props.id" :name="props.context.node.name" ref="imgInput"
                :value="props.context.node.value" :help="props.context.node.props.help" @node="handleFileChange"
                :validation="props.context.node.props.validation"
                :validation-messages="props.context.node.props.validationMessages" :multiple="false"
                file-remove-icon="close" :accept="props.context.node.props.attrs.accept" />
            <div class="upload-indicator">
                <span class="upload-loader" v-if="uploading"></span>
            </div>
            <div class="error-msg">
                <span>{{ errorMsg }}</span>
            </div>
            <div  v-for="(help, index) in props.context.help" :key="index" class="formkit-help" v-html="help || '<br>'">
            </div>
        </div>

    </div>
</template>
<style scope>
[data-type='imageUploadWithPreview'] {

    .formkit-inner:nth-child(2) {
        border: none !important;
        padding: 0 !important;
    }

    >.formkit-messages {
        display: none;
    }

    .formkit-outer:nth-child(1) {
        margin-bottom: -1px !important;
    }

    >.formkit-help {
        display: none;
    }

    .input-container .formkit-outer>.formkit-help {
        display: none;
    }

    .iuwp-container {
        width: 100%;
    }

    .formkit-help {
        margin-top: 0px;
    }

    .formkit-help:nth-child(1) {
        margin-top: 0.25rem;
    }

    
}



.img-preview-container .portrait {
    width: 100px;
    max-width: 100px;
    height: auto;
}

.img-preview-container .landscape {
    width: 210px;
    max-width: 210px;
    height: auto;
    border-radius: 5px;
}

.img-preview-container.circle  {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}



.square {
    width: 150px;
    height: 150px;
    border-radius: 5px;

    .img-loader {
        width: 150px !important;
        height: 150px;
    }
}

.five-four {
    width:150px;
    height: 120px;
    border-radius: 5px;

    .img-loader {
        width: 150px !important;
        height: 120px;
    }
}

.four-five {
    width:120px;
    height: 150px;
    border-radius: 5px;

    .img-loader {
        width: 120px !important;
        height: 150px;
    }
}

.circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    /* overflow:hidden;
    z-index:2; */

    .img-loader {
        width:  80px !important;
        height: 80px;
        border-radius: 50%;
    }
}

.portrait {
    width: 100px;
    max-width: 100px;
    height: auto;

    .img-loader {
        width: 90px !important;
        height: 150px;
    }
}

.landscape {
    max-width: 200px;
    width: 210px;
    height: 100%;
    @apply rounded-md;
}

.landscape .img-loader {
    width: 200px !important;
    height: 100px;
}

/* LOADER STYLES */

.img-loader {
    display: block;
    width: 64px;
    height: 64px;
    position: relative;
    background: #FFF;
    border-radius: 4px;
    overflow: hidden;
}

.img-loader:before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    transform: rotate(45deg) translate(30%, 40%);
    background: #f2f3f8;
    box-shadow: 32px -34px 0 5px #b0b0b0;
}

.img-loader:after {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #b0b0b0;
    transform: rotate(0deg);
    transform-origin: 35px 145px;
}

.img-loader.is-uploading:before {
    animation: slide 2s infinite ease-in-out alternate;
}

.img-loader.is-uploading:after {
    animation: rotate 2s infinite ease-in-out;
}

@keyframes slide {

    0%,
    100% {
        bottom: -35px
    }

    25%,
    75% {
        bottom: -2px
    }

    20%,
    80% {
        bottom: 2px
    }
}

@keyframes rotate {
    0% {
        transform: rotate(-15deg)
    }

    25%,
    75% {
        transform: rotate(0deg)
    }

    100% {
        transform: rotate(-15deg)
    }
}



.upload-loader {
    display: block;
    position: relative;
    left: 0;
    height: 4px;
    width: 100%;
    border: 1px solid transparent;
    border-radius: 2px;
    overflow: hidden;
}

.upload-loader::after {
    content: '';
    width: 150%;
    height: 100%;
    background: #d70a8d;
    opacity: 0.5;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    animation: animloader 1s linear infinite;
}

@keyframes animloader {
    0% {
        left: 0;
        transform: translateX(-100%);
    }

    100% {
        left: 100%;
        transform: translateX(0%);
    }
}

.error-msg {
    color: #dc3545;
    font-size: 80%;
    margin-top: 0.25rem;
}
</style>