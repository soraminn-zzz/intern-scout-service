Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "register", to: "auth#register"
      post "login", to: "auth#login"
      get "me", to: "auth#me"

      resource :intern_profile, only: %i[show update]
      resources :interns, only: %i[index show]
      resources :messages, only: %i[index show create]
      resources :job_posts, only: %i[index show create update]
      resources :favorite_interns, only: %i[index create destroy]
      resources :saved_job_posts, only: %i[index create destroy]
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
