class Query < ActiveRecord::Base
    has_many :query_results

    validates :radius, numericality: { only_integer: true }
    
end
