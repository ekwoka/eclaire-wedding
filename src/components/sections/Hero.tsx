import { ButtonLink } from '@/atoms';
import { component$ } from '@builder.io/qwik';

const Testimonial = component$(() => {
  return (
    <figure class="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left prose">
      <div class="flex justify-center text-blue-600 lg:justify-start">
        stars
      </div>
      <blockquote class="mt-2">
        <p class="">
          This method of designing icons is genius. I wish I had known this
          method a lot sooner.
        </p>
      </blockquote>
      <figcaption class="mt-2">
        <strong class="before:content-['—_']">Stacey Solomon</strong>, Founder
        at Retail Park
      </figcaption>
    </figure>
  );
});

export const Hero = component$(() => {
  return (
    <header class="bg-slate-100 lg:bg-transparent lg:px-5 mb-10">
      <div class="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-36 lg:pt-20 xl:py-32">
        <div class="relative flex items-end lg:col-span-5 lg:row-span-2">
          <div class="absolute -bottom-12 -top-20 left-0 right-1/2 z-10 rounded-br-3xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40 overflow-hidden">
            <div class="heropattern-endlessclouds-blue-500 absolute -inset-20"></div>
          </div>
          <div class="relative z-10 mx-auto flex w-64 rounded-xl bg-slate-600 shadow-xl md:w-80 lg:w-auto overflow-hidden">
            <img
              class="w-full"
              src="https://placekitten.com/600/800"
              alt=""
              width="600"
              height="800"
            />
          </div>
        </div>
        <div class="relative px-4 sm:px-6 lg:col-span-7 lg:pb-14 lg:pl-16 lg:pr-0 xl:pl-20">
          <div class="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100" />
          <Testimonial />
        </div>
        <div class="bg-white pt-16 lg:col-span-7 lg:bg-transparent lg:pl-16 lg:pt-0 xl:pl-20">
          <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0 prose">
            <h1 class="">Get lost in the world of icon design.</h1>
            <p class="mt-4">
              A book and video course that teaches you how to design your own
              icons from scratch.
            </p>
          </div>
          <div class="mt-8 flex gap-4 justify-center">
            <ButtonLink href="#free-chapters" color="blue">
              Get sample chapter
            </ButtonLink>
            <ButtonLink href="#pricing" variant="outline" color="blue">
              Buy book
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
});
