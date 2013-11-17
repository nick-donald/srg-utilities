require 'spec_helper'

describe SessionsController do
    describe 'GET signin' do
        it 'returns user' do
            get :create, email: 'bob@example.com'
        end
    end
end