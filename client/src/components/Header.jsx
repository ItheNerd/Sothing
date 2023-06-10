export default function Header() {
  return (
    <div className="relative overflow-hidden bg-white sm:pt-20">
      <div className="h-screen pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Lorem ipsum dolor sit amet
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel
              nihil voluptatem unde, illum vitae voluptate corrupti optio velit
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-[50%] lg:top-1/2 lg:-translate-y-[70%] lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img
                          src="https://images.unsplash.com/photo-1579493593714-9223eb053e87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGNvbXB1dGVyJTIwaGFyZHdhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvbXB1dGVyJTIwaGFyZHdhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        {/* <img
                            src="https://images.unsplash.com/photo-1620368523635-df9d83338fc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tcHV0ZXIlMjBoYXJkd2FyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          /> */}
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1627281796892-39e266ee50be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXIlMjBoYXJkd2FyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1618764400608-9e7115eede74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvbXB1dGVyJTIwaGFyZHdhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1555617981-dac3880eac6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGNvbXB1dGVyJTIwaGFyZHdhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGNvbXB1dGVyJTIwaGFyZHdhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a href="#" className="btn-primary btn">
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
