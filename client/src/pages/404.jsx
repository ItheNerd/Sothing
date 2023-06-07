import illustration from "@/assets/illustration.svg"

export default function NotFound() {
  return (
    <section class="bg-white dark:bg-gray-900 ">
      <div class="container mx-auto min-h-screen px-6 py-12 lg:flex lg:items-center lg:gap-12">
        <div class="wf-ull lg:w-1/2">
          <p class="text-sm font-medium text-primary">
            404 error
          </p>
          <h1 class="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Page not found
          </h1>
          <p class="mt-4 text-gray-500 dark:text-gray-400">
            Sorry, the page you are looking for doesn't exist.Here are some
            helpful links:
          </p>

          <div class="mt-6 flex items-center gap-x-3">
            <button class="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 rtl:rotate-180">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>Go back</span>
            </button>

            <button class="btn btn-neutral hover:btn-primary btn-wide">
              Take me home
            </button>
          </div>
        </div>

        <div class="relative mt-12 w-full lg:mt-0 lg:w-1/2">
          <img
            class="w-full max-w-lg lg:mx-auto"
            src={illustration}
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
