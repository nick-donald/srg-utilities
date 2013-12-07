# These methods may need to be split into different modules
module Addresser
	# Gems
	require 'rubygems'
	require 'open-uri' # To be refactored with Net::HTTP
	require 'geocoder'
	require 'json'
	require 'simple_xlsx'
	require 'spreadsheet'
	require 'roo'
	# Api keys module (hidden from public repo)

	def addresser(query, inputCity, radius)

		# Split the inputed queries into array
		query_formatted = query.split(/,{1}\s*/)

		# Store array, city, and radius in info hash,
		# hold on to retailer and city for file name
		info = Hash.new
		info["Retailers"] = query_formatted
		@@retailers_string = query_formatted.join("_")
		info["City"] = inputCity
		@@city = inputCity
		info["Radius"] = radius
		radius = radius.to_i * 1609 # Convert miles to meters
		s = Geocoder.search(inputCity) # Geocode city

		# Create array to store location hash, iterate through each query
		results_output = Array.new
		count = 0
		
		results_push = Array.new
		query_formatted.each do |q|

			# UrlEncode city and get JSON from Google.
			q.gsub!(/\s/, "%20")
			uri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{s.first.latitude},#{s.first.longitude}&radius=#{radius}&name=#{q}&sensor=false&key=#{ENV['GOOGLE_API_KEY']}"
			puts uri
			obj = open(uri).read
			object = JSON.parse(obj)
			results = object["results"]

			break if object['status'] == 'INVALID_REQUEST' # Break if something bad was send (i.e. radius != integer)

			# Otherwise status is OK, proceed
			info["status"] = "OK"

			
			results_uniq = Hash.new

			# For each result in the Google output, 
			# add it to our results array 'results_push'
			# if it has the type 'store' and its address is unique
			# (checked by hash 'results_uniq')
			results.each do |result|
				vicinity = result["vicinity"]
				if result["types"].include? "store"
					if !results_uniq[vicinity]
						results_uniq[vicinity] = 1
						result['name'].gsub!(/'/,"&rsquo;")
						result['store_name'] = q
						results_push << result
					end
				end
			end

			# Add the results for this query to our global return Array
			# and increment count, then sleep for a bit so we don't make
			# Google mad.
			# results_output[count] = results_push
			count += 1
			sleep 0.5
		end

		# if results_output.count > 0
		if results_push.count > 0
			# return info, results_output ---> Commenting this out while I test this for Backbone
			# It will return an array of objects, to be used as a collection on the front end
			return results_push
		else
			info['status'] = 'INVALID_REQUEST'
			return info
		end
	end

	def detail_finder(data)
		results = data["response"]

		@return_group = []

		count = 0;

		for i in 0...results.count
			num = i.to_s
			for j in 0...results[num].count
				
				num_j = j.to_s
				ref = results[num][num_j]["reference"]

				uri = "https://maps.googleapis.com/maps/api/place/details/json?reference=#{ref}&sensor=false&key=#{ApiKeys.google_places_key}"

				obj = open(uri).read

				object = JSON.parse(obj)

				if (j == 0) 
					puts object
				end

				@return_group << object["result"]["formatted_phone_number"]

				sleep 0.5

			end
		end


		return @return_group
	end

	# def assemble_excel(data)

	# 	headers = data["columns"]

	# 	length = data["results"].count

	# 	@filepath = "#{Rails.root}/public/uploads/#{@@retailers_string}_#{@@city}_spreadsheet.xlsx"

	# 	SimpleXlsx::Serializer.new(@filepath) do |doc|
	# 		doc.add_sheet("Results") do |sheet|
	# 			sheet.add_row(headers)

	# 			data["results"].each do |result|
	# 				row_data = []
	# 				result[1].each do |k,v|
	# 					row_data << v
	# 				end
	# 				sheet.add_row(row_data)
	# 			end
	# 		end
	# 	end

		
	# 	return @filepath
	# end

	def assemble_excel(data)
		headers = Array.new
		data[0].attributes.each do |k, v|
			if v != nil && k != 'id' && k != 'query_id'
				headers << k
			end
		end
		query = Query.find_by_id(data[0].query_id)
		query_formatted = query.query.gsub!(/\,+\s*/, '_')

		filepath = "#{Rails.root}/public/uploads/#{query.query}_#{query.center}_spreadsheet.xlsx"

		query.update(filepath: filepath)

		SimpleXlsx::Serializer.new(filepath) do |doc|
			doc.add_sheet("Results") do |sheet|
				sheet.add_row(headers)

				data.each do |result|
					row_data = []
					for i in 0...headers.count
						row_data << result[headers[i]]
					end
					sheet.add_row(row_data)
				end
			end
		end
	end

	def mapOutput(filepath)

		@output = []

		re = /(?:\.)(\w+)$/i

		fExtension = re.match(filepath)[1]
		
		if fExtension == 'xls'
			book = Roo::Excel.new(filepath)
		elsif fExtension == 'xlsx'
			book = Roo::Excelx.new(filepath)
		end

		book.default_sheet = book.sheets.first

		for i in book.first_column..book.last_column
			@output << book.cell(1, i)
		end

		@output << filepath

		return @output
	end

	def confirm_names(data)
		filepath = data['filepath']
		names_col = data['column1']

		re = /(?:\.)(\w+)$/i
		fExtension = re.match(filepath)[1]

		if fExtension == 'xls'
			book = Roo::Excel.new(filepath)
		elsif fExtension == 'xlsx'
			book = Roo::Excelx.new(filepath)
		end

		book.default_sheet = book.sheets.first
		start = book.first_row + 1

		

		for i in book.first_column..book.last_column
			if names_col == book.cell(1, i)
				names_col_num = i
			end
		end

		names = Array.new

		first = book.first_row + 1

		for j in first..book.last_row
			names[j] = book.cell(j, names_col_num)
		end


		data['names'] = names.uniq
		return data

	end

	def extract_spreadsheet(data)

		filepath = data['filepath']

		# Create array of regular expressions to get base retailer name
		# in cases where other names are given by Google Places API
		regexs = Array.new
		data['names'].each do |name|
			str = sprintf(".*%s.*", name)
			regexs << Regexp.new(str, true)
		end

		# Determine is file has '.xls' or '.xlsx' extension, then access with Roo
		re = /(?:\.)(\w+)$/i
		fExtension = re.match(filepath)[1]
		if fExtension == 'xls'
			book = Roo::Excel.new(filepath)
		elsif fExtension == 'xlsx'
			book = Roo::Excelx.new(filepath)
		end

		# Loop through header row to find 'names' and 'addresses' columns
		# from user input
		book.default_sheet = book.sheets.first
		for i in 1..book.last_column
			case book.cell(1, i)
			when data['column1']
				name_column = i
			when data['column2']
				addr_column = i
			end
		end

		# Iterate through worksheet, create a new hash for each entry
		# and push it into the 'output' array, return 'output' and we're done
		output = Array.new
		start = book.first_row + 1
		for i in start..book.last_row
			output[i] = Hash.new
			output[i]["name"] = book.cell(i, name_column)
			for j in 0..data['names'].count
				if regexs[j] === book.cell(i, 1)
					output[i]["chain"] = data['names'][j]
				end
			end
			output[i]['addresses'] = book.cell(i, addr_column)
		end
		return output
	end

	def get_info_from_upload(data)
		
	end

	def addresser_test
		
	end
end
