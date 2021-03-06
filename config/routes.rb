SrgUtilities::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  root "main_pages#index"

  get '/query-results', to: redirect("/")

  get '/oldroot' => 'main_pages#home'

  get '/addresser' => 'addresser#exec', defaults: { format: 'json' }

  post '/addresser/download' => 'addresser#ask_to_download', defaults: { format: 'json' }

  post '/addresserDetails' => 'addresser#more_info', defaults: { format: 'json' }

  get '/download' => 'addresser#execute_download'

  get '/mapper' => 'addresser#mapper_home'

  post '/mapper/map' => 'addresser#get_map', defaults: { format: 'json' }

  post '/mapper/confirm' => 'addresser#confirm', defaults: { format: 'json' }

  post '/mapper/extract' => 'addresser#extract', defaults: { format: 'json' }

  post '/mapper/more' => 'addresser#more_info_from_uploaded', defaults: { format: 'json' }

  get '/test' => 'addresser#test', defaults: { format: 'json' }

  delete '/addresser/:id' => 'query_results#destroy'

  post 'login' => 'sessions#create'

  get '/authenticate' => 'sessions#authenticate', defaults: { format: 'json' }

  get '/query/getexcel' => 'query_results#get_excel', defaults: { format: 'json' }

  get '/query/downloadexcel' => 'query_results#download_excel'

  get '/query/index' => 'query_results#index', defaults: { format: 'json' }

  get '/query/index/detail/find' => 'query_results#index_detail', defaults: { format: 'json' }

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
