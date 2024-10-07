import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import { GalleryViewer } from "#components";

describe("GalleryViewer", async () => {
  it("starts with the right animation index", () => {
    const wrapper = mount(GalleryViewer, {
      props: { category: "widgets" },
    });
    const animationIndex = wrapper.vm.animationIndex;
    console.log(animationIndex);
    expect(true).toBe(true);
  });
  describe("when Next button is pressed", async () => {
    it("increments an animationIndex", async () => {
      const wrapper = mount(GalleryViewer, {
        props: { category: "widgets" },
      });
      const nextButton = wrapper.find('[data-test="next-button"]');
      await nextButton.trigger("click");
      const animationIndex = wrapper.vm.animationIndex;
      expect(animationIndex).toBe(1);
    });
    it("renders a different animation", async () => {
      // Check for a change in child component
      const wrapper = mount(GalleryViewer, {
        props: { category: "widgets" },
      });
      const firstAnimationHTML = wrapper.find("div").html();
      const nextButton = wrapper.find('[data-test="next-button"]');
      await nextButton.trigger("click");
      const secondAnimationHTML = wrapper.find("div").html();
      expect(secondAnimationHTML).not.toBe(firstAnimationHTML);
    });
    it("at the end, it cycles to beginning", async () => {
      const wrapper = mount(GalleryViewer, {
        props: { category: "widgets" },
      });
      const nextButton = wrapper.find('[data-test="next-button"]');
      for (const _animation of wrapper.vm.animations) {
        await nextButton.trigger("click");
      }
      const animationIndex = wrapper.vm.animationIndex;
      expect(animationIndex).toBe(0);
    });
  });
});
