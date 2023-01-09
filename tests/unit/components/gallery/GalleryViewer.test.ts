import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { setup } from "@nuxt/test-utils-edge";

import GalleryViewer from "@/components/gallery/GalleryViewer.vue";

// import AnimatedFlag from "@/components/animated/AnimatedFlag.vue";
// import AnimatedSunrise from "@/components/animated/AnimatedSunrise.vue";
// import AnimatedLoader from "@/components/animated/AnimatedLoader.vue";

describe("GalleryViewer", async () => {
  await setup();

  it("starts with the right animation index", () => {
    const wrapper = mount(GalleryViewer);
    const animationIndex = wrapper.vm.animationIndex;
    console.log(animationIndex);
    expect(animationIndex).toBe(0);
  });
  describe("when Next button is pressed", async () => {
    it("increments an animationIndex", async () => {
      const wrapper = mount(GalleryViewer);
      const nextButton = wrapper.find('[data-test="next-button"]');
      await nextButton.trigger("click");
      const animationIndex = wrapper.vm.animationIndex;
      expect(animationIndex).toBe(1);
    });
    it("renders a different animation", async () => {
      // Check for a change in child component
      const wrapper = mount(GalleryViewer);
      const firstAnimationHTML = wrapper.find("div").html();
      const nextButton = wrapper.find('[data-test="next-button"]');
      await nextButton.trigger("click");
      const secondAnimationHTML = wrapper.find("div").html();
      expect(secondAnimationHTML).not.toBe(firstAnimationHTML);
    });
    it("at the end, it cycles to beginning", async () => {
      const wrapper = mount(GalleryViewer);
      const nextButton = wrapper.find('[data-test="next-button"]');
      for (const _animation of wrapper.vm.animations) {
        await nextButton.trigger("click");
      }
      const animationIndex = wrapper.vm.animationIndex;
      expect(animationIndex).toBe(0);
    });
  });
  describe("when Previous button is pressed", async () => {
    it("renders a different animation", async () => {});
  });
});
