module Addresser
	require 'rubygems'
	require 'open-uri' # To be refactored with Net::HTTP
	require 'geocoder'
	require 'json'
	require 'simple_xlsx'
	require 'spreadsheet'
	require 'roo'
	require File.join(Rails.root, "lib/api_keys.rb")

	def addresser(query, inputCity, radius)

		info = Hash.new

		query_formatted = query.split(/,{1}\s*/)

		info["Retailers"] = query_formatted

		$retailers_string = query_formatted.join("_")

		info["City"] = inputCity

		$city = inputCity

		info["Radius"] = radius

		radius = radius.to_i * 1609

		s = Geocoder.search(inputCity)

		results_group = []
		results_output = Array.new

		count = 0;

		query_formatted.each do |q|

			q.gsub!(/\s/, "%22")

			puts "Searching #{q} in #{inputCity}..."
			
			uri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{s.first.latitude},#{s.first.longitude}&radius=#{radius}&name=#{q}&sensor=false&key=#{ApiKeys.google_places_key}"

			puts uri

			obj = open(uri).read

			object = JSON.parse(obj)

			results = object["results"]

			break if object['status'] == 'INVALID_REQUEST'

			info["status"] = "OK"

			results_push = Array.new
			results_uniq = Hash.new

			results.each do |result|
				vicinity = result["vicinity"]
				if result["types"].include? "store"
					if !results_uniq[vicinity]
						results_uniq[vicinity] = 1
						results_push << result
					end
				end
			end

			results_output[count] = results_push

			count += 1

			sleep 0.5
		end

		if results_output.count > 0
			return info, results_output
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

	def assemble_excel(data)

		headers = data["columns"]

		length = data["results"].count

		@filepath = "#{Rails.root}/public/uploads/#{$retailers_string}_#{$city}_spreadsheet.xlsx"

		SimpleXlsx::Serializer.new(@filepath) do |doc|
			doc.add_sheet("Results") do |sheet|
				sheet.add_row(headers)

				data["results"].each do |result|
					row_data = []
					result[1].each do |k,v|
						row_data << v
					end
					sheet.add_row(row_data)
				end
			end
		end

		
		return @filepath
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
end
