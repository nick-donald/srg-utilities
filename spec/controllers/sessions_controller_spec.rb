require 'spec_helper'

describe SessionsController do
    before { @user = User.find_by_email('bob@example.com') }

    describe 'signin' do
        context 'with correct password' do
            context 'with remember me checked' do
                it 'should assign permanent remember cookie' do
                    get :create, email: 'bob@example.com', password: 'password', remember_me: true
                    expect(response.cookies['remember_token']).to eq('perm')
                end
            end
        end

        context 'with inccorect password' do
            it 'should assign no cookie' do
                get :create, email: 'bob@example.com', password: 'wrong'
                expect(response.cookies['remember_token']).to be_nil
            end
        end
    end

    describe 'signout' do
    end
end