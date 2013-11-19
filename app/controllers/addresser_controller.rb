class AddresserController < ApplicationController
	include Addresser
	skip_before_filter :verify_authenticity_token, only: :get_map

	def new
		@stuff = params[:stuff]
	end

	def exec
		@query = Query.create do |q|
			q.query = params[:retailers]
			q.center = params[:city]
			q.radius = params[:radius]
		end
		inserts = []
		output = addresser(params[:retailers], params[:city], params[:radius])
		output.each do |result|
			inserts.push "(#{@query.id},'#{result['name']}','#{result['vicinity']}')"
		end
		sql = "INSERT INTO query_results (query_id, name, address) VALUES #{inserts.join(',')}"
		ActiveRecord::Base.connection.execute(sql)
		ActiveRecord::Base.connection.close

		result_ids = QueryResult.where('query_id = ?', "#{@query.id}")
		for i in 0...output.count
			output[i]['id'] = result_ids[i].id
			output[i]['query_id'] = @query.id
		end
		respond_to do |format|
			format.json { render :json => output }
		end


	end

	def insert_output(&block)
		Thread.new do
			yield
		end
	end

	def ask_to_download
		data = params[:download_data]
		assemble_excel(data)
		response = { filepath: @filepath }
		respond_to do |format|
			format.json { render :json => response }
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

	def more_info_from_uploaded
		output = get_info_from_upload(params[:data])
		respond_to do |format|
			format.json { render :json => "output" }
		end
	end

	def test
		results = []
		result = {name: 'Target', number: '555-555-5555'}
		results.push(result)
		result2 = {name: 'Walmart', number: '444-444-4444'}
		results.push(result2)
		respond_to do |format|
			format.json { render :json => results }
		end
	end

end
