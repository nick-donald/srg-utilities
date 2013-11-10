class AddresserController < ApplicationController
	include AddresserHelper
	skip_before_filter :verify_authenticity_token, only: :get_map

	def new
		@stuff = params[:stuff]
	end

	def exec
		@retailers = params[:retailers]
		@city = params[:city]
		@radius = params[:radius]
		addresser(@retailers, @city, @radius)
		@response = { request_params: @info, response: @results_output }
		respond_to do |format|
			format.json { render :json => @response }
		end
	end

	def ask_to_download
		data = params[:download_data]
		assemble_excel(data)
		response = { filepath: @filepath }
		respond_to do |format|
			format.json { render :json => response}
		end
	end

	def execute_download
		send_file params[:filepath], disposition: 'attachment'
	end

	def more_info
		@parameters = params[:prevResults]
		detail_finder(@parameters)
		respond_to do |format|
			format.json { render :json => @return_group }
		end
	end

	def get_map
		uploaded_file = params[:file]
		File.open(Rails.root.join('public', 'uploads', uploaded_file.original_filename), 'w') do |file|
			file.write(uploaded_file.read.force_encoding("UTF-8"))
			@filepath = file.path
		end
		filename = uploaded_file.original_filename
		mapOutput(@filepath)

		puts @output

		# respond_to do |format|
		# 	format.json { render :json => "stuff" }
		# end

		respond_to do |format|
			format.json { render :json => @output }
		end
	end

	def confirm
		data = params[:data]

		# output = extract_spreadsheet(data)
		output = confirm_names(data)

		respond_to do |format|
			format.json { render :json => output }
		end
	end

	def extract

		data = params[:data]

		output = extract_spreadsheet(data)

		respond_to do |format|
			format.json { render :json => output }
		end
		
	end

end
