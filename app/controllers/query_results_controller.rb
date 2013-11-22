class QueryResultsController < ApplicationController
    include Addresser

    def destroy
        QueryResult.delete(params[:id])
        render nothing: true
    end

    def get_excel
        results = QueryResult.where("query_id = ?", params[:query_id])
        query_id = params[:query_id]
        assemble_excel results
        respond_to do |format|
            format.json { render json: { query_id: query_id }}
        end
    end

    def download_excel
        query = Query.find_by_id(params[:query_id])
        send_file query.filepath
    end

    def index
        queries = Query.all
        respond_to do |format|
            format.json { render json: queries.to_json }
        end
    end

    def index_detail
        results = QueryResult.where("query_id=?", params[:id])
        respond_to do |format|
            format.json { render json: results }
        end
    end
end
