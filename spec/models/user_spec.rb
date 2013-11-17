require 'spec_helper'

describe User do
    before do
        @user = User.new(email: 'bob@example.com', password: 'password', password_confirmation: 'password')
    end

    subject { @user }

    context 'when email is not present' do
        before { @user.email = '' }
        it { should_not be_valid }
    end

    context 'when passwords dont match' do
        before { @user.password_confirmation = 'invalid' }
        it { should_not be_valid }
    end

    context 'should have remember token before save' do
        before { @user.save }
        its(:remember_token) { should_not be_blank }
    end
end