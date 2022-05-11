<template>
    <div class="container h-100 d-flex justify-content-center">
        <GMapMap
            :center="center"
            :zoom="17"
            map-type-id="terrain"
            style="width: 1600px; height: 900px"
        >
          <GMapCluster>
            <GMapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @click="center=m.position"
            />
          </GMapCluster>
        </GMapMap>
    </div>
</template>

<script>

export default {
  name: 'GoogleMap',
  data() {

    return {
      center: {lat: 50.0782, lng: 8.2398},
      markers: [
        {
          position: {
            lat: 50.0782, lng: 8.2398,
          },
        }
      ]
    }
  }
}
</script>