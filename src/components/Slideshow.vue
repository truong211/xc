<template>

  <div class="slideshow mt-12">
    <button class="nav-button prev-button" @click="prevImage">❮</button>
    <img :src="images[currentImage]" alt="Slideshow image" />
    <button class="nav-button next-button" @click="nextImage">❯</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentImage: 0,
      images: [
        '/Images/image1.png',
        '/Images/image2.png',
        '/Images/image3.png',
      ],
      intervalId: null
    };
  },
  mounted() {
    this.startSlideshow();
  },
  beforeDestroy() {
    this.stopSlideshow();
  },
  methods: {
    startSlideshow() {
      this.intervalId = setInterval(() => {
        this.nextImage();
      }, 3000);
    },
    stopSlideshow() {
      clearInterval(this.intervalId);
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.images.length;
    },
    prevImage() {
      this.currentImage = (this.currentImage - 1 + this.images.length) % this.images.length;
    }
  }
};
</script>

<style scoped>
.slideshow {

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.slideshow img {
  width: 100%;
  height: auto;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>